const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require('path');
const util = require("../utils.js")

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("CaptureTheEther");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("ChooseANickname", async function () {
  const nickname = ethers.utils.formatBytes32String("kumarnilay27");
  const tx = await contract.setNickname(nickname)
  await tx.wait();

  expect(tx.hash).to.not.be.undefined;
  util.updateTotalPoints(scriptName)
});

