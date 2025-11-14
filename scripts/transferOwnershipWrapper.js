/**
 * Wrapper script to handle arguments and call Hardhat
 * Usage: npm run transfer-ownership 0x90f79bf6eb2c4f870365e785982e1f101e93b906
 */

const { execSync } = require('child_process');
const path = require('path');

// Get the address from command line arguments
const address = process.argv[2];

if (!address) {
  console.error('❌ Error: Please provide the new owner address');
  console.log('\nUsage:');
  console.log('  npm run transfer-ownership 0x90f79bf6eb2c4f870365e785982e1f101e93b906');
  console.log('\nReplace the address with your actual MetaMask address');
  process.exit(1);
}

// Validate it looks like an address
if (!address.startsWith('0x') || address.length !== 42) {
  console.error('❌ Error: Invalid address format');
  console.log('Address must start with 0x and be 42 characters long');
  process.exit(1);
}

console.log('🔄 Transferring ownership to:', address);
console.log('');

try {
  // Call the Hardhat script with the address as an environment variable
  process.env.NEW_OWNER_ADDRESS = address;
  execSync(
    'npx hardhat run scripts/transferOwnership.js --network localhost',
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    }
  );
} catch (error) {
  console.error('\n❌ Transfer failed');
  process.exit(1);
}

