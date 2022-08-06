// run.js(ローカル実行用)
// ethersは元々hardhat側でグローバルアクセス可能なものとして提供されている。なのでわざわざフィールド変数として定義すると冗長になるため不要。
const { ethers } = require("hardhat");

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

// function Dummy(引数名) {}, funcion(引数名) {}, 引数名 => {} の3つがjsの関数の書き方
// 上記３つのうち最後のアロー式を用いた関数の書き方
const main = async () => {
    const [owner, randomPerson] = await ethers.getSigners();

    // コントラクトをデプロイするためには追加情報が必要。そのためにhre.ethers.getContractFactoryで生成されるContractFactoryはコントラクトのデプロイをサポートする
    const waveContractFactory = await ethers.getContractFactory("WavePortal");

    // このコントラクトのためだけにローカルにEthereumネットワークを作成し、コントラクトのデプロイを開始
    const waveContract = await waveContractFactory.deploy({
        // デプロイする際に0.1ETHをコントラクトに提供
        value: ethers.utils.parseEther("0.1")
    });

    // コントラクトのデプロイ完了を待つ
    const wavePortal = await waveContract.deployed();

    console.log("Contract deployed to:", wavePortal.address);

    // コントラクトの残高を取得し、結果を出力
    let contractBalance = await ethers.provider.getBalance(wavePortal.address);
    // wei単位の残高をETH単位に変換した上で出力
    console.log("Contract balance;", ethers.utils.formatEther(contractBalance));


    // waveを2回送るシュミレーション
    const waveTxn = await waveContract.wave("This is wave #1");
    await waveTxn.wait(); // トランザクションが承認されるのを待つ(テスト: 1回目)

    const waveTxn2 = await waveContract.wave("This is wave #2");
    await waveTxn2.wait();

    // waveした後のコントラクトの残高を取得し、結果を出力
    contractBalance = await ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance", ethers.utils.formatEther(contractBalance));

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};

runMain();