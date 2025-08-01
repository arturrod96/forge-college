const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Forge College Smart Contracts", function () {
  let mockUSDC, studentRegistry, cohortManager, kpiOracle, debtToken, incomeVault, repaymentManager, sponsorVault;
  let owner, student1, student2, mentor1, sponsor1, investor1;
  let student1Address, student2Address;

  beforeEach(async function () {
    [owner, student1, student2, mentor1, sponsor1, investor1] = await ethers.getSigners();
    student1Address = student1.address;
    student2Address = student2.address;

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.deployed();

    // Deploy ForgeStudentRegistry
    const ForgeStudentRegistry = await ethers.getContractFactory("ForgeStudentRegistry");
    studentRegistry = await ForgeStudentRegistry.deploy();
    await studentRegistry.deployed();

    // Deploy CohortManager
    const CohortManager = await ethers.getContractFactory("CohortManager");
    cohortManager = await CohortManager.deploy();
    await cohortManager.deployed();

    // Deploy KPIOracleMock
    const KPIOracleMock = await ethers.getContractFactory("KPIOracleMock");
    kpiOracle = await KPIOracleMock.deploy();
    await kpiOracle.deployed();

    // Deploy StudentDebtToken
    const StudentDebtToken = await ethers.getContractFactory("StudentDebtToken");
    debtToken = await StudentDebtToken.deploy();
    await debtToken.deployed();

    // Deploy IncomeAdvanceVault
    const IncomeAdvanceVault = await ethers.getContractFactory("IncomeAdvanceVault");
    incomeVault = await IncomeAdvanceVault.deploy(mockUSDC.address);
    await incomeVault.deployed();

    // Deploy RepaymentManager
    const RepaymentManager = await ethers.getContractFactory("RepaymentManager");
    repaymentManager = await RepaymentManager.deploy(mockUSDC.address, debtToken.address);
    await repaymentManager.deployed();

    // Deploy SponsorVault
    const SponsorVault = await ethers.getContractFactory("SponsorVault");
    sponsorVault = await SponsorVault.deploy(mockUSDC.address);
    await sponsorVault.deployed();

    // Setup roles
    await debtToken.grantRole(await debtToken.MINTER_ROLE(), repaymentManager.address);
    await debtToken.grantRole(await debtToken.BURNER_ROLE(), repaymentManager.address);
    await incomeVault.grantRole(await incomeVault.PAYMENT_MANAGER_ROLE(), owner.address);
    await repaymentManager.grantRole(await repaymentManager.REPAYMENT_MANAGER_ROLE(), owner.address);
    await sponsorVault.grantRole(await sponsorVault.SPONSOR_MANAGER_ROLE(), owner.address);
    await sponsorVault.grantRole(await sponsorVault.IMPACT_TRACKER_ROLE(), owner.address);
    await kpiOracle.grantRole(await kpiOracle.ORACLE_ROLE(), owner.address);
    await cohortManager.grantRole(await cohortManager.COHORT_MANAGER_ROLE(), owner.address);
    await cohortManager.grantRole(await cohortManager.MENTOR_ROLE(), owner.address);
    await studentRegistry.grantRole(await studentRegistry.COHORT_MANAGER_ROLE(), owner.address);
    await studentRegistry.grantRole(await studentRegistry.ORACLE_ROLE(), owner.address);

    // Transfer some USDC to test accounts
    await mockUSDC.transfer(student1.address, ethers.utils.parseUnits("1000", 6));
    await mockUSDC.transfer(student2.address, ethers.utils.parseUnits("1000", 6));
    await mockUSDC.transfer(investor1.address, ethers.utils.parseUnits("10000", 6));
  });

  describe("MockUSDC", function () {
    it("Should have correct name and symbol", async function () {
      expect(await mockUSDC.name()).to.equal("Mock USDC");
      expect(await mockUSDC.symbol()).to.equal("mUSDC");
      expect(await mockUSDC.decimals()).to.equal(6);
    });

    it("Should mint initial supply to deployer", async function () {
      const balance = await mockUSDC.balanceOf(owner.address);
      expect(balance).to.equal(ethers.utils.parseUnits("1000000", 6));
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.utils.parseUnits("1000", 6);
      await mockUSDC.mint(student1.address, mintAmount);
      expect(await mockUSDC.balanceOf(student1.address)).to.equal(ethers.utils.parseUnits("2000", 6));
    });
  });

  describe("ForgeStudentRegistry", function () {
    it("Should register a new student", async function () {
      await studentRegistry.registerStudent(student1Address, 1);
      const student = await studentRegistry.getStudent(1);
      expect(student.wallet).to.equal(student1Address);
      expect(student.cohortId).to.equal(1);
      expect(student.status).to.equal(0); // PENDING
    });

    it("Should update student status", async function () {
      await studentRegistry.registerStudent(student1Address, 1);
      await studentRegistry.updateStudentStatus(1, 1); // ACTIVE
      const student = await studentRegistry.getStudent(1);
      expect(student.status).to.equal(1); // ACTIVE
    });

    it("Should assign student to different cohort", async function () {
      await studentRegistry.registerStudent(student1Address, 1);
      await studentRegistry.assignCohort(1, 2);
      const student = await studentRegistry.getStudent(1);
      expect(student.cohortId).to.equal(2);
    });

    it("Should get student by wallet address", async function () {
      await studentRegistry.registerStudent(student1Address, 1);
      const student = await studentRegistry.getStudentByWallet(student1Address);
      expect(student.id).to.equal(1);
      expect(student.wallet).to.equal(student1Address);
    });
  });

  describe("CohortManager", function () {
    it("Should create a new cohort", async function () {
      const startDate = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
      const endDate = startDate + (90 * 24 * 60 * 60); // 90 days later
      
      await cohortManager.createCohort(
        "Web3 Development",
        "Learn Solidity and smart contract development",
        ["Solidity", "Hardhat", "DeFi"],
        [mentor1.address],
        startDate,
        endDate,
        20
      );

      const cohort = await cohortManager.getCohort(1);
      expect(cohort.name).to.equal("Web3 Development");
      expect(cohort.maxStudents).to.equal(20);
      expect(cohort.status).to.equal(0); // PLANNING
    });

    it("Should add milestones to cohort", async function () {
      const startDate = Math.floor(Date.now() / 1000) + 86400;
      const endDate = startDate + (90 * 24 * 60 * 60);
      
      await cohortManager.createCohort(
        "Web3 Development",
        "Learn Solidity and smart contract development",
        ["Solidity", "Hardhat", "DeFi"],
        [mentor1.address],
        startDate,
        endDate,
        20
      );

      await cohortManager.addMilestone(
        1,
        "Smart Contract Basics",
        "Deploy your first smart contract",
        startDate + (30 * 24 * 60 * 60),
        30
      );

      const milestones = await cohortManager.getCohortMilestones(1);
      expect(milestones.length).to.equal(1);
      expect(milestones[0].name).to.equal("Smart Contract Basics");
    });

    it("Should update cohort status", async function () {
      const startDate = Math.floor(Date.now() / 1000) + 86400;
      const endDate = startDate + (90 * 24 * 60 * 60);
      
      await cohortManager.createCohort(
        "Web3 Development",
        "Learn Solidity and smart contract development",
        ["Solidity", "Hardhat", "DeFi"],
        [mentor1.address],
        startDate,
        endDate,
        20
      );

      await cohortManager.updateCohortStatus(1, 1); // ACTIVE
      const cohort = await cohortManager.getCohort(1);
      expect(cohort.status).to.equal(1); // ACTIVE
    });
  });

  describe("KPIOracleMock", function () {
    it("Should set student KPI", async function () {
      await kpiOracle.setKPI(1, 85, 90, 88, 92);
      const kpi = await kpiOracle.getStudentKPI(1);
      expect(kpi.technicalScore).to.equal(85);
      expect(kpi.participationScore).to.equal(90);
      expect(kpi.projectScore).to.equal(88);
      expect(kpi.attendanceScore).to.equal(92);
    });

    it("Should calculate average score", async function () {
      await kpiOracle.setKPI(1, 80, 85, 90, 95);
      const averageScore = await kpiOracle.getAverageScore(1);
      expect(averageScore).to.equal(87); // (80 + 85 + 90 + 95) / 4 = 87.5 -> 87
    });

    it("Should check performance threshold", async function () {
      await kpiOracle.setKPI(1, 80, 85, 90, 95);
      const meetsThreshold = await kpiOracle.meetsPerformanceThreshold(1, 85);
      expect(meetsThreshold).to.be.true;
    });

    it("Should update individual KPI component", async function () {
      await kpiOracle.setKPI(1, 80, 85, 90, 95);
      await kpiOracle.updateKPIComponent(1, 0, 95); // Update technical score
      const kpi = await kpiOracle.getStudentKPI(1);
      expect(kpi.technicalScore).to.equal(95);
    });
  });

  describe("StudentDebtToken", function () {
    it("Should mint debt token", async function () {
      await debtToken.mintDebtToken(
        student1.address,
        1,
        1,
        ethers.utils.parseUnits("1000", 6),
        500, // 5% interest rate
        365, // 1 year duration
        "ipfs://metadata"
      );

      expect(await debtToken.ownerOf(1)).to.equal(student1.address);
      const metadata = await debtToken.getDebtMetadata(1);
      expect(metadata.studentId).to.equal(1);
      expect(metadata.amount).to.equal(ethers.utils.parseUnits("1000", 6));
      expect(metadata.interestRate).to.equal(500);
    });

    it("Should update repayment amount", async function () {
      await debtToken.mintDebtToken(
        student1.address,
        1,
        1,
        ethers.utils.parseUnits("1000", 6),
        500,
        365,
        "ipfs://metadata"
      );

      await debtToken.updateRepayment(1, ethers.utils.parseUnits("500", 6));
      const metadata = await debtToken.getDebtMetadata(1);
      expect(metadata.amountRepaid).to.equal(ethers.utils.parseUnits("500", 6));
      expect(metadata.isFullyRepaid).to.be.false;
    });

    it("Should mark debt as fully repaid", async function () {
      await debtToken.mintDebtToken(
        student1.address,
        1,
        1,
        ethers.utils.parseUnits("1000", 6),
        500,
        365,
        "ipfs://metadata"
      );

      await debtToken.updateRepayment(1, ethers.utils.parseUnits("1000", 6));
      const metadata = await debtToken.getDebtMetadata(1);
      expect(metadata.isFullyRepaid).to.be.true;
    });

    it("Should calculate interest", async function () {
      await debtToken.mintDebtToken(
        student1.address,
        1,
        1,
        ethers.utils.parseUnits("1000", 6),
        500, // 5% annual interest
        365,
        "ipfs://metadata"
      );

      // Fast forward time by 180 days
      await ethers.provider.send("evm_increaseTime", [180 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      const interest = await debtToken.calculateInterest(1);
      expect(interest).to.be.gt(0);
    });
  });

  describe("IncomeAdvanceVault", function () {
    it("Should accept deposits", async function () {
      const depositAmount = ethers.utils.parseUnits("10000", 6);
      await mockUSDC.approve(incomeVault.address, depositAmount);
      await incomeVault.depositFunds(depositAmount);
      
      expect(await incomeVault.totalVaultBalance()).to.equal(depositAmount);
      expect(await incomeVault.getAvailableBalance()).to.equal(depositAmount);
    });

    it("Should allocate funds to student", async function () {
      const depositAmount = ethers.utils.parseUnits("10000", 6);
      await mockUSDC.approve(incomeVault.address, depositAmount);
      await incomeVault.depositFunds(depositAmount);

      const allocationAmount = ethers.utils.parseUnits("3000", 6);
      const monthlySalary = ethers.utils.parseUnits("1000", 6);
      
      await incomeVault.allocateStudentFunds(1, allocationAmount, monthlySalary, 3);
      
      const payment = await incomeVault.getStudentPayment(1);
      expect(payment.totalAllocated).to.equal(allocationAmount);
      expect(payment.monthlySalary).to.equal(monthlySalary);
      expect(payment.isActive).to.be.true;
    });

    it("Should release payment to student", async function () {
      const depositAmount = ethers.utils.parseUnits("10000", 6);
      await mockUSDC.approve(incomeVault.address, depositAmount);
      await incomeVault.depositFunds(depositAmount);

      const allocationAmount = ethers.utils.parseUnits("3000", 6);
      const monthlySalary = ethers.utils.parseUnits("1000", 6);
      
      await incomeVault.allocateStudentFunds(1, allocationAmount, monthlySalary, 3);
      
      const paymentAmount = ethers.utils.parseUnits("1000", 6);
      await incomeVault.releasePayment(1, paymentAmount);
      
      const payment = await incomeVault.getStudentPayment(1);
      expect(payment.totalPaid).to.equal(paymentAmount);
    });
  });

  describe("RepaymentManager", function () {
    beforeEach(async function () {
      // Mint a debt token first
      await debtToken.mintDebtToken(
        student1.address,
        1,
        1,
        ethers.utils.parseUnits("1000", 6),
        500,
        365,
        "ipfs://metadata"
      );
    });

    it("Should accept repayment", async function () {
      const repaymentAmount = ethers.utils.parseUnits("500", 6);
      await mockUSDC.approve(repaymentManager.address, repaymentAmount);
      await repaymentManager.acceptRepayment(1, repaymentAmount);
      
      const history = await repaymentManager.getStudentRepaymentHistory(1);
      expect(history.totalRepaid).to.equal(repaymentAmount);
      expect(history.repaymentCount).to.equal(1);
    });

    it("Should force repayment (TESTNET ONLY)", async function () {
      const forceAmount = ethers.utils.parseUnits("500", 6);
      await repaymentManager.forceRepayment(1, forceAmount);
      
      const history = await repaymentManager.getStudentRepaymentHistory(1);
      expect(history.totalRepaid).to.equal(forceAmount);
    });

    it("Should calculate repayment progress", async function () {
      const repaymentAmount = ethers.utils.parseUnits("500", 6);
      await mockUSDC.approve(repaymentManager.address, repaymentAmount);
      await repaymentManager.acceptRepayment(1, repaymentAmount);
      
      const progress = await repaymentManager.getStudentRepaymentProgress(1);
      expect(progress).to.equal(5000); // 50% (500/1000 * 10000)
    });
  });

  describe("SponsorVault", function () {
    it("Should register a sponsor", async function () {
      await sponsorVault.registerSponsor(
        sponsor1.address,
        "Scroll Foundation",
        "Supporting Web3 education",
        ethers.utils.parseUnits("50000", 6)
      );
      
      const sponsor = await sponsorVault.getSponsor(sponsor1.address);
      expect(sponsor.name).to.equal("Scroll Foundation");
      expect(sponsor.totalDeposited).to.equal(ethers.utils.parseUnits("50000", 6));
      expect(sponsor.isActive).to.be.true;
    });

    it("Should create sponsorship", async function () {
      await sponsorVault.registerSponsor(
        sponsor1.address,
        "Scroll Foundation",
        "Supporting Web3 education",
        ethers.utils.parseUnits("50000", 6)
      );

      const sponsorshipAmount = ethers.utils.parseUnits("10000", 6);
      await sponsorVault.createSponsorship(
        sponsor1.address,
        1,
        0, // Cohort-wide sponsorship
        sponsorshipAmount,
        90, // 90 days
        "Supporting Web3 Development Cohort"
      );

      const sponsorship = await sponsorVault.getSponsorship(1);
      expect(sponsorship.sponsor).to.equal(sponsor1.address);
      expect(sponsorship.amount).to.equal(sponsorshipAmount);
      expect(sponsorship.cohortId).to.equal(1);
    });

    it("Should update impact metrics", async function () {
      await sponsorVault.updateImpactMetrics(100, ethers.utils.parseUnits("500000", 6), 5);
      
      const metrics = await sponsorVault.impactMetrics();
      expect(metrics.totalStudentsFunded).to.equal(100);
      expect(metrics.totalUSDDistributed).to.equal(ethers.utils.parseUnits("500000", 6));
      expect(metrics.totalCohortsSupported).to.equal(5);
    });

    it("Should get cohort sponsorships", async function () {
      await sponsorVault.registerSponsor(
        sponsor1.address,
        "Scroll Foundation",
        "Supporting Web3 education",
        ethers.utils.parseUnits("50000", 6)
      );

      await sponsorVault.createSponsorship(
        sponsor1.address,
        1,
        0,
        ethers.utils.parseUnits("10000", 6),
        90,
        "Supporting Web3 Development Cohort"
      );

      const sponsorships = await sponsorVault.getCohortSponsorships(1);
      expect(sponsorships.length).to.equal(1);
      expect(sponsorships[0]).to.equal(1);
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full student lifecycle", async function () {
      // 1. Register student
      await studentRegistry.registerStudent(student1Address, 1);
      
      // 2. Create cohort
      const startDate = Math.floor(Date.now() / 1000) + 86400;
      const endDate = startDate + (90 * 24 * 60 * 60);
      await cohortManager.createCohort(
        "Web3 Development",
        "Learn Solidity and smart contract development",
        ["Solidity", "Hardhat", "DeFi"],
        [mentor1.address],
        startDate,
        endDate,
        20
      );
      
      // 3. Set KPI
      await kpiOracle.setKPI(1, 85, 90, 88, 92);
      
      // 4. Deposit funds to vault
      const depositAmount = ethers.utils.parseUnits("10000", 6);
      await mockUSDC.approve(incomeVault.address, depositAmount);
      await incomeVault.depositFunds(depositAmount);
      
      // 5. Allocate funds to student
      await incomeVault.allocateStudentFunds(1, ethers.utils.parseUnits("3000", 6), ethers.utils.parseUnits("1000", 6), 3);
      
      // 6. Mint debt token
      await debtToken.mintDebtToken(
        student1.address,
        1,
        1,
        ethers.utils.parseUnits("3000", 6),
        500,
        365,
        "ipfs://metadata"
      );
      
      // 7. Register sponsor
      await sponsorVault.registerSponsor(
        sponsor1.address,
        "Scroll Foundation",
        "Supporting Web3 education",
        ethers.utils.parseUnits("50000", 6)
      );
      
      // 8. Create sponsorship
      await sponsorVault.createSponsorship(
        sponsor1.address,
        1,
        1,
        ethers.utils.parseUnits("3000", 6),
        90,
        "Supporting Student 1"
      );
      
      // Verify all systems are working together
      expect(await studentRegistry.getTotalStudents()).to.equal(1);
      expect(await cohortManager.getTotalCohorts()).to.equal(1);
      expect(await debtToken.getStudentTotalDebt(1)).to.equal(ethers.utils.parseUnits("3000", 6));
      expect(await sponsorVault.getStudentTotalSponsorship(1)).to.equal(ethers.utils.parseUnits("3000", 6));
    });
  });
}); 