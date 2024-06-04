// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;
contract PlaylistLikes {
    // mapping(address => uint) public userCoins;
    mapping(address => uint) public balances;
    uint public constant LIKE_THRESHOLD = 5;
    uint public constant COIN_REWARD = 500; // 0.5 Ether

    event CoinRewarded(address indexed user, uint coins);
    event Transfer(address indexed from, address indexed to, uint value);
    constructor (){
        balances[msg.sender] = 100000000;
    }

    function getUserCoins(address user) public view returns (uint) {
        return balances[user];
    }

    // function rewardUser(address user ) public {
    //     require(balances[msg.sender] >= COIN_REWARD, "Insufficient contract balance.");
    //     uint256 reward = COIN_REWARD ;
    //     userCoins[user] += reward;
    //     transfer(user, reward);
    //     emit CoinRewarded(user, reward);
    // }

    function transfer(address to ,uint value ) public returns (bool) {
        
        require(balances[msg.sender] >= value, "Insufficient balance.");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}