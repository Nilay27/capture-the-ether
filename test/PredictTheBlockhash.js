const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x3C9899E6CE18Cbd2c3f5EF8f81cbC1F5b35AEC86";

beforeEach(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory(
    "PredictTheBlockHashChallenge"
  );
  contract = factory.attach(CHALLENGE_ADDRESS);
});
/**
 * NOTE:
 * 1. Comment out lock in guess, when you are calling settle.
 * 2. Do not call settle just after calling lock in guess, as it will set guesser to 0 (there is not revert
 * in settle if guess != answer).
 * hence if you call lockinGuess again, it will not revert
 */
// it("PredictTheBlockHash lock in guess", async function () {
//   /**
//    * If settle is called 1 hour after the lockInGuess(), block.blockhash(blockNumber)
//    * will return zero, as blockhash of only last 256 blocks are tracked, so we need to guess 0.
//    */
//   const guess = ethers.utils.formatBytes32String(0);
//   const tx = await contract.lockInGuess(guess, {
//     value: ethers.utils.parseEther("1"),
//     gasLimit: 3e6,
//   });
//   console.log("submitting guess as: ", guess);
//   await tx.wait();
//   console.log("guess submitted");
// });

it("PredictTheBlockHash settle", async function () {
  /**
   * This should be called one hour after locking in the guess
   */
  const tx = await contract.settle({ gasLimit: 3e6 });
  console.log("setteling transaction ");
  await tx.wait();
  console.log("settled");
  const isComplete = await contract.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
