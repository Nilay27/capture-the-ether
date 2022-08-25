---
 Title: capture-the-ether
 Description: Solutions for Capture The Ether CTF
 Progress: 2050/11600
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
- [ ] PredictTheFuture (500 points)
- [ ] PredictTheBlockhash (750 points)
- [x] TokenSale (500 points)
- [ ] TokenWhale (500 points)
- [ ] RetirementFund (500 points)
- [ ] Mapping (750 points)
- [ ] Donation (750 points)
- [ ] FiftyYears (2000 points)
- [ ] FuzzyIdentity (500 points)
- [ ] PublicKey (750 points)
- [ ] AccountTakeover (1500 points)
- [ ] AssumeOwnership (300 points)
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