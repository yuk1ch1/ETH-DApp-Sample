// テスト用ファイル

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

// run.js
const main = async () => {
    // Hardhatが提供する関数。任意のアドレスを返す。
    // コントラクト所有者のウォレットアドレスとwaveを送るユーザーのウォレットアドレスを変数ownerとrandomPersonに格納
    // Signer object: トランザクションをcontractや他のイーサaccountへ送るために使われる
    // getSignersでつながっているノード状のaccountのリストを取得
    const [owner, randomPerson] = await ethers.getSigners();
    // コントラクトを取得
    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    // 取得したコントラクトをローカルEthereumネットワークにデプロイ
    const waveContract = await waveContractFactory.deploy();
    // デプロイが完了するまで待つ
    const wavePortal = await waveContract.deployed();

    // デプロイが完了したら各アドレスをログ出力
    console.log("Contract deployed to:", wavePortal.address);
    console.log("Contract deployed by:", owner.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    // wave関数ではブロックチェーン上に書き込みが発生するのでガス代がかかるため、waveを送ろうしているユーザーからの承認を取る必要がある
    // なので承認を待つ間コントラクトからの応答をフロント側は待つ必要がある
    // 承認されるとawait waveTxn.wait()が実行されて、トランザクションの結果が取得される

    let waveTxn = await waveContract.wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
};

runMain();