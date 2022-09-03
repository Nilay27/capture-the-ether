---
 Title: capture-the-ether
 Description: Solutions for Capture The Ether CTF
 Progress: 10350/11600
---
* Executable solutions for all challenges from [CaptureTheEther.com](https://capturetheether.com/)
* Nickname - kumar.nilay
* Address - [`0x0c1A47d859841275291feFF89C10c62886c29aF2`](https://ropsten.etherscan.io/address/0x0c1A47d859841275291feFF89C10c62886c29aF2)

### Challenges
- [x] DeployAContract (50 points)
- [x] CallMe (100 points)
- [x] ChooseANickname (200 points)
- [x] GuessTheNumber (200 points)
- [x] GuessTheSecretNumber (300 points)
- [x] GuessTheRandomNumber (300 points)
- [x] GuessTheNewNumber (400 points)
- [x] PredictTheFuture (500 points)
- [x] PredictTheBlockhash (750 points)
- [x] TokenSale (500 points)
- [x] TokenWhale (500 points)
- [x] RetirementFund (500 points)
- [x] Mapping (750 points)
- [x] Donation (750 points)
- [x] FiftyYears (2000 points)
- [ ] FuzzyIdentity (500 points)
- [x] PublicKey (750 points)
- [x] AccountTakeover (1500 points)
- [x] AssumeOwnership (300 points)
- [ ] TokenBank (750 points)

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