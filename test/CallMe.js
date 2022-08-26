const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0x16a73514172C8B1876F485259e40779E95012c49`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("CallMeChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("CallMe", async function () {
  const tx = await contract.callme();
  await tx.wait();

  var isComplete = await contract.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
