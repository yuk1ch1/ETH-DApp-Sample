// WavePortal.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // コントラクト変数を定義し、初期値を設定しない場合には各型のデフォルト値が可能されるみたい(https://book.ethereum-jp.net/solidity/var_and_data_type)

    // NewWaveイベントの作成
    event NewWave(address indexed from, uint256 timestamp, string message);

    /* 
    Waveという構造体を作成
    構造体の中身は、カスタマイズすることができる
    */
    struct Wave {
        address waver; // 「👋（wave）」を送ったユーザーのアドレス
        string message; // ユーザーが送ったメッセージ
        uint256 timestamp; // ユーザーが「👋（wave）」を送った瞬間のタイムスタンプ
    }

    /*
    構造体の配列を格納するための変数wavesを宣言
    これでユーザーが送ってきた全ての「👋（wave）」を保持することができます
    */

    Wave[] waves;
    constructor() {
        console.log("WavePortal - Smart Contract!");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}

// 仮説検証を全て自分で実行したくてプログラミングを覚え始めたのにもう目的になってしまって最近は仮説を立てられてないな
