const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockUSDC first
  console.log("\n1. Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  console.log("MockUSDC deployed to:", await mockUSDC.getAddress());

  // Deploy ForgeStudentRegistry
  console.log("\n2. Deploying ForgeStudentRegistry...");
  const ForgeStudentRegistry = await ethers.getContractFactory("ForgeStudentRegistry");
  const studentRegistry = await ForgeStudentRegistry.deploy();
  await studentRegistry.waitForDeployment();
  console.log("ForgeStudentRegistry deployed to:", await studentRegistry.getAddress());

  // Deploy CohortManager
  console.log("\n3. Deploying CohortManager...");
  const CohortManager = await ethers.getContractFactory("CohortManager");
  const cohortManager = await CohortManager.deploy();
  await cohortManager.waitForDeployment();
  console.log("CohortManager deployed to:", await cohortManager.getAddress());

  // Deploy KPIOracleMock
  console.log("\n4. Deploying KPIOracleMock...");
  const KPIOracleMock = await ethers.getContractFactory("KPIOracleMock");
  const kpiOracle = await KPIOracleMock.deploy();
  await kpiOracle.waitForDeployment();
  console.log("KPIOracleMock deployed to:", await kpiOracle.getAddress());

  // Deploy StudentDebtToken
  console.log("\n5. Deploying StudentDebtToken...");
  const StudentDebtToken = await ethers.getContractFactory("StudentDebtToken");
  const debtToken = await StudentDebtToken.deploy();
  await debtToken.waitForDeployment();
  console.log("StudentDebtToken deployed to:", await debtToken.getAddress());

  // Deploy IncomeAdvanceVault
  console.log("\n6. Deploying IncomeAdvanceVault...");
  const IncomeAdvanceVault = await ethers.getContractFactory("IncomeAdvanceVault");
  const incomeVault = await IncomeAdvanceVault.deploy(await mockUSDC.getAddress());
  await incomeVault.waitForDeployment();
  console.log("IncomeAdvanceVault deployed to:", await incomeVault.getAddress());

  // Deploy RepaymentManager
  console.log("\n7. Deploying RepaymentManager...");
  const RepaymentManager = await ethers.getContractFactory("RepaymentManager");
  const repaymentManager = await RepaymentManager.deploy(await mockUSDC.getAddress(), await debtToken.getAddress());
  await repaymentManager.waitForDeployment();
  console.log("RepaymentManager deployed to:", await repaymentManager.getAddress());

  // Deploy SponsorVault
  console.log("\n8. Deploying SponsorVault...");
  const SponsorVault = await ethers.getContractFactory("SponsorVault");
  const sponsorVault = await SponsorVault.deploy(await mockUSDC.getAddress());
  await sponsorVault.waitForDeployment();
  console.log("SponsorVault deployed to:", await sponsorVault.getAddress());

  // Grant roles and permissions
  console.log("\n9. Setting up permissions...");
  
  // Grant MINTER_ROLE to RepaymentManager for debt tokens
  await debtToken.grantRole(await debtToken.MINTER_ROLE(), await repaymentManager.getAddress());
  console.log("Granted MINTER_ROLE to RepaymentManager");

  // Grant BURNER_ROLE to RepaymentManager for debt tokens
  await debtToken.grantRole(await debtToken.BURNER_ROLE(), await repaymentManager.getAddress());
  console.log("Granted BURNER_ROLE to RepaymentManager");

  // Grant PAYMENT_MANAGER_ROLE to deployer for income vault
  await incomeVault.grantRole(await incomeVault.PAYMENT_MANAGER_ROLE(), deployer.address);
  console.log("Granted PAYMENT_MANAGER_ROLE to deployer");

  // Grant REPAYMENT_MANAGER_ROLE to deployer for repayment manager
  await repaymentManager.grantRole(await repaymentManager.REPAYMENT_MANAGER_ROLE(), deployer.address);
  console.log("Granted REPAYMENT_MANAGER_ROLE to deployer");

  // Grant SPONSOR_MANAGER_ROLE to deployer for sponsor vault
  await sponsorVault.grantRole(await sponsorVault.SPONSOR_MANAGER_ROLE(), deployer.address);
  console.log("Granted SPONSOR_MANAGER_ROLE to deployer");

  // Grant IMPACT_TRACKER_ROLE to deployer for sponsor vault
  await sponsorVault.grantRole(await sponsorVault.IMPACT_TRACKER_ROLE(), deployer.address);
  console.log("Granted IMPACT_TRACKER_ROLE to deployer");

  // Grant ORACLE_ROLE to deployer for KPI oracle
  await kpiOracle.grantRole(await kpiOracle.ORACLE_ROLE(), deployer.address);
  console.log("Granted ORACLE_ROLE to deployer");

  // Grant COHORT_MANAGER_ROLE to deployer for cohort manager
  await cohortManager.grantRole(await cohortManager.COHORT_MANAGER_ROLE(), deployer.address);
  console.log("Granted COHORT_MANAGER_ROLE to deployer");

  // Grant MENTOR_ROLE to deployer for cohort manager
  await cohortManager.grantRole(await cohortManager.MENTOR_ROLE(), deployer.address);
  console.log("Granted MENTOR_ROLE to deployer");

  // Grant COHORT_MANAGER_ROLE to deployer for student registry
  await studentRegistry.grantRole(await studentRegistry.COHORT_MANAGER_ROLE(), deployer.address);
  console.log("Granted COHORT_MANAGER_ROLE to deployer");

  // Grant ORACLE_ROLE to deployer for student registry
  await studentRegistry.grantRole(await studentRegistry.ORACLE_ROLE(), deployer.address);
  console.log("Granted ORACLE_ROLE to deployer");

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("MockUSDC:", await mockUSDC.getAddress());
  console.log("ForgeStudentRegistry:", await studentRegistry.getAddress());
  console.log("CohortManager:", await cohortManager.getAddress());
  console.log("KPIOracleMock:", await kpiOracle.getAddress());
  console.log("StudentDebtToken:", await debtToken.getAddress());
  console.log("IncomeAdvanceVault:", await incomeVault.getAddress());
  console.log("RepaymentManager:", await repaymentManager.getAddress());
  console.log("SponsorVault:", await sponsorVault.getAddress());
  console.log("\nAll contracts deployed successfully!");
  console.log("Deployer address:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 