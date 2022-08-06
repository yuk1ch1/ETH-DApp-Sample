// WavePortal.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // コントラクト変数を定義し、初期値を設定しない場合には各型のデフォルト値が可能されるみたい(https://book.ethereum-jp.net/solidity/var_and_data_type)
    uint256 private seed; // 乱数生成のための基盤となるシード(種)を作成

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

    // address => uint mappingはアドレスと数値を紐づける
    mapping(address => uint256) public lastWaveAt;

    // payableを付けることで、コントラクトに送金機能を実装している
    constructor() payable {
        console.log("We have been constructed!");

        // 初期シードを設定
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // 現在の時刻が、前回waveを送信した時刻より15分以上過ぎていることを確認
        require(lastWaveAt[msg.sender] + 15 minutes < block.timestamp, "Wait 15m");
        
        // ユーザーの現在のタイムスタンプを更新する
        lastWaveAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved", msg.sender);

        // 「👋（wave）」とメッセージを配列に格納。
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // ユーザーのために乱数を生成
        // block.difficulty: ブロック承認(= マイニング)の何度をマイナーに通知するための値。ブロック内のトランザクションが多いほど、難易度は高くなる
        // block.timestamp: ブロックが処理されている時のUNIXタイムスタンプ
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generatd: %d", seed);

        // ユーザーがETHを獲得する確率を50%に設定
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            // コントラクトへ関与してくれた、「👋（wave）」を送ってくれたユーザーに0.0001ETHを送る
            uint256 prizeAmount = 0.0001 ether;
            // address(this).balanceでコントラクが持つ残高を確認
            // 賞金が残高より少ないか確認している。falseならトランザクションが中止され、右側の文言が表示される。trueなら引き続き後続の処理が実行される
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdra more money than the contract has"
            );

            // コントラクトに関与してくれたユーザーにethを送金
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            // 送金結果が失敗ならトランザクションが中止され、右側の文言が表示される？
            require(success, "Failed to withdraw mone from contract.");
        } else {
            console.log("%s did not win.", msg.sender);
        }

        // フロントエンドへイベント送信
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
