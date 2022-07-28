// WavePortal.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // コントラクト変数を定義し、初期値を設定しない場合には各型のデフォルト値が可能されるみたい(https://book.ethereum-jp.net/solidity/var_and_data_type)

    // スマートコントラクトに含まれる関数を呼び出すには、ウォレットを接続する必要がある 
    constructor() {
        console.log("Here is my first smart contract!");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!",totalWaves);
        return totalWaves;
    }
}



// 仮説検証を全て自分で実行したくてプログラミングを覚え始めたのにもう目的になってしまって最近は仮説を立てられてないな