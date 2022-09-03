const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");
const EC = require('elliptic').ec
const R = require('ramda')


var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0x5eC4da87555B77301AD83fb32ACfa2640e9dE8fe`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("AccountTakeoverChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("CallMe", async function () {
    const owner = `0x6B477781b0e68031109f21887e6B5afEAaEB002b`;
    // pick only outgoing tx
    console.log("This challenge basically relies on the fact that in one of the txns")
    console.log("Same value of 'r' was used")

    console.log("Get all transactions of the account and match r, first two txns made by the account!")
   // pick the only outgoing tx
    const tx1Hash = `0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396`;
    const tx2Hash = `0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009`;
    const tx1 = await eoa.provider.getTransaction(tx1Hash);
    const tx2 = await eoa.provider.getTransaction(tx2Hash);
    console.log("two tx with same r are:")
    console.log(tx1)
    console.log(tx2)

    const tx1Data = {
        gasPrice: tx1.gasPrice,
        gasLimit: tx1.gasLimit,
        value: tx1.value,
        nonce: tx1.nonce,
        data: tx1.data,
        to: tx1.to,
        chainId: tx1.chainId,
      };
    const tx2Data = {
        gasPrice: tx2.gasPrice,
        gasLimit: tx2.gasLimit,
        value: tx2.value,
        nonce: tx2.nonce,
        data: tx2.data,
        to: tx2.to,
        chainId: tx2.chainId,
      };
    const tx1signingData = ethers.utils.serializeTransaction(tx1Data);
    const z1 = ethers.utils.keccak256(tx1signingData);

    const tx2signingData = ethers.utils.serializeTransaction(tx2Data);
    const z2 = ethers.utils.keccak256(tx2signingData);

    console.log("z1", z1)
    console.log("z2", z2)
    console.log("use some python library to get pvt key from here onwards :p")
    console.log("ref: https://bitcoin.stackexchange.com/questions/37760/converting-ruby-script-into-python-recovering-private-key-when-someone-uses-th/37762#37762")
    pvtKey = "0x614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269"
    console.log("pvt key :", pvtKey)

    const OWNER = new ethers.Wallet(pvtKey, ethers.provider);
    console.log(await ethers.provider.getBalance(OWNER.address))
    console.log("authenticate tx intitiated");
    tx = await contract.connect(OWNER).authenticate({ gasLimit: 3e6 });
    await tx.wait();
    console.log("authenticate tx completed");

    var isComplete = await contract.isComplete();
    expect(isComplete).to.be.true;
    util.updateTotalPoints(scriptName);
});
