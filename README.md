# capture-the-ether-sols
* Executable solutions for all challenges from [CaptureTheEther.com](https://capturetheether.com/)
* Nickname - kumar.nilay
* Address - [`0x0c1A47d859841275291feFF89C10c62886c29aF2`](https://ropsten.etherscan.io/address/0x0c1A47d859841275291feFF89C10c62886c29aF2)

### Progress
- [x] DeployAContract
- [x] CallMe
- [x] ChooseANickname
- [x] GuessTheNumber
- [x] GuessTheSecretNumber
- [x] GuessTheRandomNumber
- [x] GuessTheNewNumber
- [] PredictTheFuture
- [] PredictTheBlockhash

### Steps to setup in local

* Install dependencies

```
yarn
```

* Setup `.env` file with your own keys

* Compile all the contracts
```
npx hardhat compile
```

* Update challenge address in the test file and run challenge test to pass the challenges on Ropsten Network
```
npx hardhat test test/TokenBank.js --network ropsten
```