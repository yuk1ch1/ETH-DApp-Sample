// run.js
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
    // 任意のアドレスを返す
    const [owner, randomPerson] = await ethers.getSigners();

    // コントラクトをデプロイするためには追加情報が必要。ContractFactoryはコントラクトのデプロイをサポートする。そのためにhre.ethers.getContractFactoryでContractFactoryのインスタンスを生成
    const waveContractFactory = await ethers.getContractFactory("WavePortal");

    // このコントラクトのためだけにローカルにEthereumネットワークを作成し、コントラクトのデプロイを開始
    const waveContract = await waveContractFactory.deploy();

    // コントラクトのデプロイ完了を待つ
    const wavePortal = await waveContract.deployed();

    console.log("Contract deployed to:", wavePortal.address);
    console.log("Contract deployed by:", owner.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    // waveを送る
    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait(); // トランザクションが承認されるのを待つ(テスト: 1回目)

    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait(); // トランザクションが承認されるのを待つ(テスト: 2回目)

    let allWaves = await waveContract.getAllWaves()
    console.log(allWaves);
};

runMain();