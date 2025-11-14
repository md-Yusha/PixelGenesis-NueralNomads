const hre = require("hardhat");

/**
 * Script to transfer RoleManager ownership to a new address
 * Uses the deployer's private key (Hardhat default account 0)
 */
async function main() {
  console.log("🔄 Transferring RoleManager ownership...\n");

  // Get contract addresses
  const contractAddresses = require("../frontend/src/contractAddresses.json");
  const roleManagerAddress = contractAddresses.RoleManager;

  if (!roleManagerAddress) {
    throw new Error("RoleManager address not found in contractAddresses.json");
  }

  // Get the deployer account (account 0 - this is the well-known Hardhat account)
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Using deployer account:", deployer.address);
  console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Get the new owner address from environment variable (set by wrapper) or command line
  let newOwnerAddress = process.env.NEW_OWNER_ADDRESS;
  
  // Fallback: try to get from command line arguments (for direct hardhat usage)
  if (!newOwnerAddress) {
    // Find arguments after '--' separator
    const dashDashIndex = process.argv.indexOf('--');
    if (dashDashIndex !== -1 && process.argv.length > dashDashIndex + 1) {
      newOwnerAddress = process.argv[dashDashIndex + 1];
    }
  }
  
  if (!newOwnerAddress) {
    console.error("❌ Error: Please provide the new owner address");
    console.log("\nUsage:");
    console.log("  npm run transfer-ownership 0x90f79bf6eb2c4f870365e785982e1f101e93b906");
    console.log("\nOr:");
    console.log("  NEW_OWNER_ADDRESS=0x90f79bf6eb2c4f870365e785982e1f101e93b906 npx hardhat run scripts/transferOwnership.js --network localhost");
    console.log("\nOr:");
    console.log("  npx hardhat run scripts/transferOwnership.js --network localhost -- 0x90f79bf6eb2c4f870365e785982e1f101e93b906");
    process.exit(1);
  }

  // Validate address
  if (!hre.ethers.isAddress(newOwnerAddress)) {
    throw new Error(`Invalid address: ${newOwnerAddress}`);
  }

  const normalizedNewOwner = hre.ethers.getAddress(newOwnerAddress);
  console.log("🎯 New owner address:", normalizedNewOwner);

  // Verify contract exists at address
  const code = await hre.ethers.provider.getCode(roleManagerAddress);
  if (code === '0x' || code === '0x0') {
    throw new Error(
      `RoleManager contract not deployed at address: ${roleManagerAddress}\n` +
      `Please deploy contracts first by running: npm run deploy`
    );
  }

  // Get RoleManager contract
  const RoleManager = await hre.ethers.getContractFactory("RoleManager");
  const roleManager = RoleManager.attach(roleManagerAddress);

  // Check current owner
  let currentOwner;
  try {
    currentOwner = await roleManager.owner();
    console.log("👤 Current owner:", currentOwner);
  } catch (err) {
    throw new Error(
      `Failed to read contract owner. The contract might not be deployed correctly.\n` +
      `Error: ${err.message}\n` +
      `Please redeploy contracts: npm run deploy`
    );
  }

  if (currentOwner.toLowerCase() === normalizedNewOwner.toLowerCase()) {
    console.log("✅ The address is already the owner!");
    return;
  }

  if (currentOwner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error("❌ Error: Deployer account is not the current owner");
    console.log("   Current owner:", currentOwner);
    console.log("   Deployer:", deployer.address);
    process.exit(1);
  }

  // Transfer ownership
  console.log("\n📤 Transferring ownership...");
  const tx = await roleManager.setOwner(normalizedNewOwner);
  console.log("   Transaction hash:", tx.hash);

  console.log("⏳ Waiting for confirmation...");
  const receipt = await tx.wait();
  
  if (receipt.status === 1) {
    console.log("✅ Ownership transferred successfully!");
    console.log("   New owner:", normalizedNewOwner);
    
    // Verify
    const verifiedOwner = await roleManager.owner();
    if (verifiedOwner.toLowerCase() === normalizedNewOwner.toLowerCase()) {
      console.log("✅ Verification: Ownership confirmed on-chain");
    } else {
      console.log("⚠️  Warning: Verification failed");
    }
  } else {
    console.error("❌ Transaction failed");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

