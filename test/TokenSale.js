const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const path = require('path');
const util = require("../utils.js")

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0xB3e512Cd0050A9D513d9BD48702f0a2A4990DB90";

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("TokenSaleChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("TokenSale", async function () {
    const calculateAmountFactory = await ethers.getContractFactory("CalculateAmount");
    console.log('deploying calculate contract')
    calculateContract = await calculateAmountFactory.deploy()
    await calculateContract.deployed()
    console.log("calculate contract deployed")
    const result = await calculateContract.calculate()
    console.log(result)
    const tx = await contract.buy(result[0], { value: result[1] });
    await tx.wait();
    console.log("your token balance", await contract.balanceOf(eoa.address))

    const tx2 = await contract.sell(1, { gasLimit: 3e6 });
    console.log("sell tx intitiated");
    await tx2.wait();
    console.log("sell completed");
    var isComplete = await contract.isComplete();
    expect(isComplete).to.be.true;
    util.updateTotalPoints(scriptName)
});

