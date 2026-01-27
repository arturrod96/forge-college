const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CohortManager Benchmark", function () {
  let cohortManager;
  let owner;
  let mentorAddresses = [];

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Generate 50 random mentor addresses
    mentorAddresses = [];
    for (let i = 0; i < 50; i++) {
        mentorAddresses.push(ethers.Wallet.createRandom().address);
    }

    // Deploy CohortManager
    const CohortManager = await ethers.getContractFactory("CohortManager");
    cohortManager = await CohortManager.deploy();
    if (cohortManager.waitForDeployment) {
        await cohortManager.waitForDeployment();
    } else {
        await cohortManager.deployed();
    }
  });

  it("Should benchmark assignMentor gas usage", async function () {
    const startDate = Math.floor(Date.now() / 1000) + 86400;
    const endDate = startDate + (90 * 24 * 60 * 60);

    // Create a cohort with NO mentors initially
    await cohortManager.createCohort(
      "Benchmark Cohort",
      "Testing gas",
      ["Topics"],
      [], // No mentors initially
      startDate,
      endDate,
      100
    );

    console.log("\n  Gas Usage for assignMentor:");
    console.log("  -----------------------------");

    const steps = [1, 5, 10, 20, 30, 40, 50];

    for (let i = 0; i < 50; i++) {
        const mentor = mentorAddresses[i];

        const tx = await cohortManager.assignMentor(1, mentor);
        const receipt = await tx.wait();

        if (steps.includes(i + 1)) {
            console.log(`  Mentor #${i + 1}: ${receipt.gasUsed.toString()} gas`);
        }
    }
  });
});
