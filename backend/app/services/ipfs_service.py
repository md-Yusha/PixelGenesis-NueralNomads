"""IPFS service for storing and retrieving documents."""
import json
from typing import Any

import requests

from app.core.config import settings


class IPFSService:
    """Service for interacting with IPFS via Pinata or web3.storage API."""

    def __init__(self):
        self.provider = settings.PIXELGENESIS_IPFS_PROVIDER.lower()
        self.api_url = settings.PIXELGENESIS_IPFS_API_URL
        self.gateway_url = settings.PIXELGENESIS_IPFS_GATEWAY_URL
        self.api_token = settings.PIXELGENESIS_IPFS_API_TOKEN
        
        # Set headers based on provider
        if self.provider == "pinata":
            self.headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json",
            }
        else:  # web3storage
            self.headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json",
            }

    def upload_file(self, file_content: bytes, filename: str = "document.json") -> str:
        """
        Upload a file to IPFS and return the CID.
        
        Args:
            file_content: The file content as bytes
            filename: Optional filename for the upload
            
        Returns:
            CID (Content Identifier) string
        """
        try:
            if self.provider == "pinata":
                # Pinata API endpoint
                files = {
                    "file": (filename, file_content, "application/octet-stream")
                }
                pinata_metadata = {
                    "name": filename
                }
                pinata_options = {
                    "cidVersion": 1
                }
                
                response = requests.post(
                    f"{self.api_url}/pinning/pinFileToIPFS",
                    headers={
                        "Authorization": f"Bearer {self.api_token}",
                    },
                    files=files,
                    data={
                        "pinataMetadata": json.dumps(pinata_metadata),
                        "pinataOptions": json.dumps(pinata_options)
                    },
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()
                # Pinata returns IpfsHash field
                return result.get("IpfsHash") or result.get("ipfsHash")
            
            else:  # web3storage
                files = {
                    "file": (filename, file_content, "application/octet-stream")
                }
                response = requests.post(
                    f"{self.api_url}/upload",
                    headers={"Authorization": f"Bearer {self.api_token}"},
                    files=files,
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()
                return result.get("cid") or result.get("_cid") or result.get("ipfsHash")
                
        except requests.RequestException as e:
            # In development, return a mock CID if API fails
            if settings.is_development:
                return f"mock_cid_{hash(file_content)}"
            raise Exception(f"Failed to upload to IPFS ({self.provider}): {str(e)}")

    def upload_json(self, data: dict[str, Any]) -> str:
        """
        Upload JSON data to IPFS.
        
        Args:
            data: Dictionary to upload as JSON
            
        Returns:
            CID string
        """
        try:
            if self.provider == "pinata":
                # Pinata supports direct JSON upload
                pinata_content = {
                    "pinataContent": data,
                    "pinataMetadata": {
                        "name": "credential-data"
                    },
                    "pinataOptions": {
                        "cidVersion": 1
                    }
                }
                
                response = requests.post(
                    f"{self.api_url}/pinning/pinJSONToIPFS",
                    headers=self.headers,
                    json=pinata_content,
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()
                return result.get("IpfsHash") or result.get("ipfsHash")
            
            else:  # web3storage - convert to bytes and upload
                json_bytes = json.dumps(data, sort_keys=True).encode("utf-8")
                return self.upload_file(json_bytes, "data.json")
                
        except requests.RequestException as e:
            # In development, return a mock CID if API fails
            if settings.is_development:
                import hashlib
                json_str = json.dumps(data, sort_keys=True)
                hash_obj = hashlib.sha256(json_str.encode())
                return f"mock_cid_{hash_obj.hexdigest()[:16]}"
            raise Exception(f"Failed to upload JSON to IPFS ({self.provider}): {str(e)}")

    def build_gateway_url(self, cid: str) -> str:
        """
        Build a gateway URL for accessing IPFS content.
        
        Args:
            cid: IPFS CID
            
        Returns:
            Full gateway URL
        """
        return f"{self.gateway_url}/{cid}"

    def retrieve_file(self, cid: str) -> bytes:
        """
        Retrieve a file from IPFS via gateway.
        
        Args:
            cid: IPFS CID
            
        Returns:
            File content as bytes
        """
        url = self.build_gateway_url(cid)
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.content
        except requests.RequestException as e:
            raise Exception(f"Failed to retrieve from IPFS: {str(e)}")

    def retrieve_json(self, cid: str) -> dict[str, Any]:
        """
        Retrieve and parse JSON from IPFS.
        
        Args:
            cid: IPFS CID
            
        Returns:
            Parsed JSON dictionary
        """
        content = self.retrieve_file(cid)
        return json.loads(content.decode("utf-8"))


# Global service instance
ipfs_service = IPFSService()


