const { expect } = require("chai");
const { ethers } = require("hardhat");
const path = require("path");
const util = require("../utils.js");

var scriptName = path.basename(__filename);

const CHALLENGE_ADDRESS = `0x3AF21c8bc00E6859A8074C4Ed949F0e286512799`;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory = await ethers.getContractFactory("PublicKeyChallenge");
  contract = factory.attach(CHALLENGE_ADDRESS);
});

it("CallMe", async function () {
  const txHash =
    "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb";
  console.log("Tx hash of the account: ", txHash);
  console.log("Getting raw tx data");
  const firstTx = await eoa.provider.getTransaction(txHash);
  console.log("Recreating txData from the raw data fetched");
  const txData = {
    gasPrice: firstTx.gasPrice,
    gasLimit: firstTx.gasLimit,
    value: firstTx.value,
    nonce: firstTx.nonce,
    data: firstTx.data,
    to: firstTx.to,
    chainId: firstTx.chainId,
  };
  console.log("getting the signing data and msgHash");
  const signingData = ethers.utils.serializeTransaction(txData);
  const msgHash = ethers.utils.keccak256(signingData);
  console.log("signingData", signingData);
  console.log("msgHash", msgHash);
  console.log("getting signature fron v,r,s");
  const signature = { r: firstTx.r, s: firstTx.s, v: firstTx.v };
  console.log("getting raw public key");
  let rawPublicKey = ethers.utils.recoverPublicKey(msgHash, signature);
  // need to strip of the 0x04 prefix indicating that it's a raw public key
  expect(rawPublicKey.slice(2, 4), "not a raw public key").to.equal(`04`);
  rawPublicKey = `0x${rawPublicKey.slice(4)}`;

  tx = await contract.authenticate(rawPublicKey);
  await tx.wait();
  var isComplete = await contract.isComplete();
  expect(isComplete).to.be.true;
  util.updateTotalPoints(scriptName);
});
