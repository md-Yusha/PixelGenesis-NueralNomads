// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RoleManager
 * @dev Smart contract for managing user roles (Owner, Issuer, Verifier)
 */
contract RoleManager {
    // Owner address
    address public owner;
    
    // Mapping to check if an address is an issuer
    mapping(address => bool) public issuers;
    
    // Mapping to check if an address is a verifier
    mapping(address => bool) public verifiers;
    
    // Events
    event OwnerSet(address indexed newOwner);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {
        owner = msg.sender;
        emit OwnerSet(msg.sender);
    }
    
    /**
     * @dev Modifier to restrict access to owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    /**
     * @dev Transfer ownership to a new address
     * @param newOwner The new owner address
     */
    function setOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
        emit OwnerSet(newOwner);
    }
    
    /**
     * @dev Add an issuer by their public key (address)
     * @param issuerAddress The address of the issuer to add
     */
    function addIssuer(address issuerAddress) public onlyOwner {
        require(issuerAddress != address(0), "Issuer address cannot be zero");
        require(!issuers[issuerAddress], "Address is already an issuer");
        issuers[issuerAddress] = true;
        emit IssuerAdded(issuerAddress);
    }
    
    /**
     * @dev Remove an issuer
     * @param issuerAddress The address of the issuer to remove
     */
    function removeIssuer(address issuerAddress) public onlyOwner {
        require(issuers[issuerAddress], "Address is not an issuer");
        issuers[issuerAddress] = false;
        emit IssuerRemoved(issuerAddress);
    }
    
    /**
     * @dev Add a verifier by their public key (address)
     * @param verifierAddress The address of the verifier to add
     */
    function addVerifier(address verifierAddress) public onlyOwner {
        require(verifierAddress != address(0), "Verifier address cannot be zero");
        require(!verifiers[verifierAddress], "Address is already a verifier");
        verifiers[verifierAddress] = true;
        emit VerifierAdded(verifierAddress);
    }
    
    /**
     * @dev Remove a verifier
     * @param verifierAddress The address of the verifier to remove
     */
    function removeVerifier(address verifierAddress) public onlyOwner {
        require(verifiers[verifierAddress], "Address is not a verifier");
        verifiers[verifierAddress] = false;
        emit VerifierRemoved(verifierAddress);
    }
    
    /**
     * @dev Check if an address has a specific role
     * @param userAddress The address to check
     * @return isOwner True if the address is the owner
     * @return isIssuer True if the address is an issuer
     * @return isVerifier True if the address is a verifier
     */
    function getUserRole(address userAddress) 
        public 
        view 
        returns (bool isOwner, bool isIssuer, bool isVerifier) 
    {
        return (
            userAddress == owner,
            issuers[userAddress],
            verifiers[userAddress]
        );
    }
    
    /**
     * @dev Get the role name for an address
     * @param userAddress The address to check
     * @return role The role name: "owner", "issuer", "verifier", or "user"
     */
    function getRole(address userAddress) public view returns (string memory role) {
        if (userAddress == owner) {
            return "owner";
        } else if (issuers[userAddress]) {
            return "issuer";
        } else if (verifiers[userAddress]) {
            return "verifier";
        } else {
            return "user";
        }
    }
}

