const { expect } = require("chai");
const { ethers } = require("hardhat");

const CHALLENGE_ADDRESS = "0xf141F7bA7157fD093c3d5c42Bb4637c1bc07451D";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const chFactory = await ethers.getContractFactory(
    "GuessTheNewNumberChallenge"
  );
  contract = chFactory.attach(CHALLENGE_ADDRESS);
});

it("GuessTheNewNumber", async function () {
  const solFactory = await ethers.getContractFactory(
    "GuessTheNewNumberSolution"
  );
  solContract = await solFactory.deploy(contract.address, {});
  console.log("contract deployed");

  const tx = await solContract.solve({ value: ethers.utils.parseEther("1.0") });
  console.log("attack tx initiated");
  await tx.wait();
  console.log("attack completed");
  const isComplete = await contract.isComplete();
  console.log("attack success");
  expect(isComplete).to.be.true;
});
