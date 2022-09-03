const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = "0x9dEC5fe8eE74EC47c4A9B7a3CB0297E556C011E2";

before(async () => {
  accounts = await ethers.getSigners();
  player = accounts[0];
  const chFactory = await ethers.getContractFactory("FuzzyIdentityChallenge");
  chContract = chFactory.attach(CHALLENGE_ADDRESS);
});
// contract 0x820c3F59509d464c101f1C786e6442517EfF68cD
// salt -> 12536049
it("FuzzyIdentity", async function () {
  const fuzzyFactory = await ethers.getContractFactory("FuzzyIdentityFactory");
  fuzzyFactoryContract = await fuzzyFactory.attach(
    "0x820c3F59509d464c101f1C786e6442517EfF68cD"
  );
  console.log(fuzzyFactoryContract.address);
  console.log("fuzzy factory contract deployed");

  const begin = Math.floor(Date.now() / 1000);

  const creationCode =
    require("../artifacts/contracts/FuzzyIdentitySolution.sol/FuzzyIdentitySolution.json").bytecode;
  const factoryAddress = fuzzyFactoryContract.address;

  const prefix = "0xff" + factoryAddress.slice(2);
  const suffix = ethers.utils.keccak256(creationCode).slice(2);

  var salt = 12536049;
  while (true) {
    const saltHex = salt.toString(16).padStart(64, "0");
    const concatString = prefix.concat(saltHex).concat(suffix);
    const hashed = ethers.utils.keccak256(concatString);
    // console.log(`salt: ${salt}, hashed: ${hashed}`);
    if (hashed.substr(26).includes("badc0de")) {
      console.log(`salt: ${salt}, hashed: ${hashed}`);
      break;
    }
    if (salt % 100000 == 0) {
      console.log(salt);
    }
    salt++;
  }
  const end = Math.floor(Date.now() / 1000);
  console.log(`begin: ${begin}`);
  console.log(`end: ${end} `);
  console.log(`pass: ${end - begin}`);

  tx = await fuzzyFactoryContract.createInstance(salt);
  await tx.wait();

  const solFactory = await ethers.getContractFactory("FuzzyIdentitySolution");
  solContract = await solFactory.attach(
    await fuzzyFactoryContract.solContract()
  );

  tx = await solContract.callAuthenticate(CHALLENGE_ADDRESS);
  await tx.wait();

  const isComplete = await chContract.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
