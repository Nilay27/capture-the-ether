// SPDX-License-Identifier: MIT

pragma solidity ^0.4.21;

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge(address _player) public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance < 1 ether;
    }

    function buy(uint256 numTokens) public payable {
        require(msg.value == numTokens * PRICE_PER_TOKEN);

        balanceOf[msg.sender] += numTokens;
    }

    function sell(uint256 numTokens) public {
        require(balanceOf[msg.sender] >= numTokens);

        balanceOf[msg.sender] -= numTokens;
        msg.sender.transfer(numTokens * PRICE_PER_TOKEN);
    }
}

contract CalculateAmount{
    function calculate() public pure returns(uint256, uint256 ){
        uint256 MAX_UINT = 2**256-1;
        uint256 requiredTokenAmount = (MAX_UINT/10**18) + 1;
        uint256 val = requiredTokenAmount * 10**18;
        return (requiredTokenAmount, val);
    }
}