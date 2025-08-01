const { ethers } = require("hardhat");

async function main() {
  console.log("Testing configuration...");
  
  // Check if we can get signers
  try {
    const [deployer] = await ethers.getSigners();
    console.log("✅ Deployer address:", deployer.address);
    console.log("✅ Deployer balance:", ethers.formatEther(await deployer.getBalance()), "ETH");
  } catch (error) {
    console.log("❌ Error getting signers:", error.message);
  }
  
  // Check network
  try {
    const network = await ethers.provider.getNetwork();
    console.log("✅ Network chainId:", network.chainId);
  } catch (error) {
    console.log("❌ Error getting network:", error.message);
  }
  
  // Check environment variables
  console.log("Environment variables:");
  console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "Set" : "Not set");
  console.log("SCROLL_SEPOLIA_RPC_URL:", process.env.SCROLL_SEPOLIA_RPC_URL ? "Set" : "Not set");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 