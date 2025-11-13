"""Blockchain service for interacting with EVM smart contracts."""
from typing import Any

try:
    from web3 import Web3
    from web3.exceptions import ContractLogicError, TransactionNotFound
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    # Create dummy classes for type hints
    class Web3:
        pass
    class ContractLogicError(Exception):
        pass
    class TransactionNotFound(Exception):
        pass

from app.core.config import settings


# Minimal ABI stubs for DID and VC registries
DID_REGISTRY_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "did", "type": "string"}],
        "name": "registerDID",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "did", "type": "string"}],
        "name": "getDID",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
]

VC_REGISTRY_ABI = [
    {
        "inputs": [{"internalType": "bytes32", "name": "vcHash", "type": "bytes32"}],
        "name": "registerVCHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bytes32", "name": "vcHash", "type": "bytes32"}],
        "name": "isVCRevoked",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bytes32", "name": "vcHash", "type": "bytes32"}],
        "name": "revokeVCHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


class BlockchainService:
    """Service for interacting with EVM blockchain and smart contracts."""

    def __init__(self):
        self.chain_id = settings.PIXELGENESIS_CHAIN_ID
        
        # Check if web3 is available
        if not WEB3_AVAILABLE:
            self._mock_mode = True
            self.w3 = None
            self.did_registry = None
            self.vc_registry = None
            if not settings.is_development:
                raise ImportError(
                    "web3 is not installed. Install it with: pip install -r requirements-web3.txt\n"
                    "On Windows, you may need Microsoft Visual C++ Build Tools first."
                )
            return
        
        try:
            self.w3 = Web3(Web3.HTTPProvider(settings.PIXELGENESIS_RPC_URL))
            
            # Validate connection
            if not self.w3.is_connected():
                if settings.is_development:
                    # In development, allow mock mode
                    self._mock_mode = True
                else:
                    raise Exception("Failed to connect to blockchain RPC")
            else:
                self._mock_mode = False
        except Exception:
            # If connection fails, use mock mode in development
            if settings.is_development:
                self._mock_mode = True
                self.w3 = None
            else:
                raise

        # Initialize contracts (will be None if addresses are placeholders or in mock mode)
        self.did_registry = None
        self.vc_registry = None
        
        if not self._mock_mode and self.w3:
            if settings.PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS != "0xDID_REGISTRY_PLACEHOLDER":
                self.did_registry = self.w3.eth.contract(
                    address=Web3.to_checksum_address(settings.PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS),
                    abi=DID_REGISTRY_ABI
                )
            
            if settings.PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS != "0xVC_REGISTRY_PLACEHOLDER":
                self.vc_registry = self.w3.eth.contract(
                    address=Web3.to_checksum_address(settings.PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS),
                    abi=VC_REGISTRY_ABI
                )

    def _hash_to_bytes32(self, vc_hash: str) -> bytes:
        """Convert a hex string hash to bytes32."""
        # Remove 0x prefix if present
        if vc_hash.startswith("0x"):
            vc_hash = vc_hash[2:]
        # Pad or truncate to 32 bytes (64 hex chars)
        vc_hash = vc_hash[:64].ljust(64, "0")
        return bytes.fromhex(vc_hash)
    
    def _check_web3_available(self):
        """Check if web3 is available, raise error if not in mock mode."""
        if not WEB3_AVAILABLE and not self._mock_mode:
            raise ImportError("web3 is required for blockchain operations. Install with: pip install -r requirements-web3.txt")

    def register_vc_hash(self, vc_hash: str, private_key: str | None = None) -> str:
        """
        Register a VC hash on-chain.
        
        Args:
            vc_hash: SHA-256 hash of the VC (hex string)
            private_key: Private key for signing (if None, uses mock in dev)
            
        Returns:
            Transaction hash
        """
        if self._mock_mode or self.vc_registry is None:
            # Mock transaction hash in development
            return f"0x{'0' * 64}"

        self._check_web3_available()
        
        if private_key is None:
            raise ValueError("Private key required for blockchain transactions")

        try:
            account = self.w3.eth.account.from_key(private_key)
            hash_bytes = self._hash_to_bytes32(vc_hash)
            
            # Build transaction
            transaction = self.vc_registry.functions.registerVCHash(hash_bytes).build_transaction({
                "from": account.address,
                "nonce": self.w3.eth.get_transaction_count(account.address),
                "gas": 100000,
                "gasPrice": self.w3.eth.gas_price,
                "chainId": self.chain_id,
            })
            
            # Sign and send
            signed_txn = self.w3.eth.account.sign_transaction(transaction, private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            return tx_hash.hex()
        except ContractLogicError as e:
            raise Exception(f"Contract logic error: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to register VC hash: {str(e)}")

    def is_vc_revoked(self, vc_hash: str) -> bool:
        """
        Check if a VC hash is revoked on-chain.
        
        Args:
            vc_hash: SHA-256 hash of the VC (hex string)
            
        Returns:
            True if revoked, False otherwise
        """
        if self._mock_mode or self.vc_registry is None:
            # Mock: return False in development
            return False

        self._check_web3_available()

        try:
            hash_bytes = self._hash_to_bytes32(vc_hash)
            result = self.vc_registry.functions.isVCRevoked(hash_bytes).call()
            return result
        except Exception as e:
            # In development, return False on error
            if settings.is_development:
                return False
            raise Exception(f"Failed to check VC revocation status: {str(e)}")

    def revoke_vc_hash(self, vc_hash: str, private_key: str | None = None) -> str:
        """
        Revoke a VC hash on-chain.
        
        Args:
            vc_hash: SHA-256 hash of the VC (hex string)
            private_key: Private key for signing (if None, uses mock in dev)
            
        Returns:
            Transaction hash
        """
        if self._mock_mode or self.vc_registry is None:
            # Mock transaction hash in development
            return f"0x{'1' * 64}"

        self._check_web3_available()
        
        if private_key is None:
            raise ValueError("Private key required for blockchain transactions")

        try:
            account = self.w3.eth.account.from_key(private_key)
            hash_bytes = self._hash_to_bytes32(vc_hash)
            
            # Build transaction
            transaction = self.vc_registry.functions.revokeVCHash(hash_bytes).build_transaction({
                "from": account.address,
                "nonce": self.w3.eth.get_transaction_count(account.address),
                "gas": 100000,
                "gasPrice": self.w3.eth.gas_price,
                "chainId": self.chain_id,
            })
            
            # Sign and send
            signed_txn = self.w3.eth.account.sign_transaction(transaction, private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            return tx_hash.hex()
        except ContractLogicError as e:
            raise Exception(f"Contract logic error: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to revoke VC hash: {str(e)}")


# Global service instance
blockchain_service = BlockchainService()


