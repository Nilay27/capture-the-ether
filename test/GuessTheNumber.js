const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require('path');
const util = require("../utils.js")

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0xe76858cc3F6d72E46c97bD272C061b4Cb564A2F2";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("GuessTheNumberChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("GuessTheNumberChallenge", async function () {
  const tx = await contract.guess(42, {
    value: ethers.utils.parseEther("1.0"),
  });
  await tx.wait();
  expect(tx.hash).to.not.be.undefined;
  util.updateTotalPoints(scriptName)
});
