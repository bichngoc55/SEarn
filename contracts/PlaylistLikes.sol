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
        balances[msg.sender] = 10000000000000000000000;
    }

    function getUserCoins(address user) public view returns (uint) {
        return balances[user];
    } 

    function transfer(address to ,uint value ) public returns (bool) {
        
        require(balances[msg.sender] >= value, "Insufficient balance.");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}