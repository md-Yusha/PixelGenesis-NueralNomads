const hre = require("hardhat");

/**
 * Quick script to check the current owner of RoleManager contract
 */
async function main() {
  console.log("🔍 Checking RoleManager contract owner...\n");

  // Get contract addresses
  const contractAddresses = require("../frontend/src/contractAddresses.json");
  const roleManagerAddress = contractAddresses.RoleManager;

  if (!roleManagerAddress) {
    throw new Error("RoleManager address not found in contractAddresses.json");
  }

  console.log("📋 RoleManager address:", roleManagerAddress);

  // Get RoleManager contract
  const RoleManager = await hre.ethers.getContractFactory("RoleManager");
  const roleManager = RoleManager.attach(roleManagerAddress);

  // Check current owner
  const owner = await roleManager.owner();
  console.log("👤 Current contract owner:", owner);
  console.log("");

  // Check your address
  const yourAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const normalizedYourAddress = hre.ethers.getAddress(yourAddress);
  const normalizedOwner = hre.ethers.getAddress(owner);

  console.log("🎯 Your address:", normalizedYourAddress);
  console.log("👤 Contract owner:", normalizedOwner);
  console.log("");

  if (normalizedOwner.toLowerCase() === normalizedYourAddress.toLowerCase()) {
    console.log("✅ SUCCESS: You are the contract owner!");
  } else {
    console.log("❌ MISMATCH: You are NOT the contract owner");
    console.log("");
    console.log("💡 To fix this, run:");
    console.log(`   npm run transfer-ownership ${normalizedYourAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

