const { ethers } = require("hardhat")

// deploy.js
const main = async () => {
  const [deployer] = await ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    // デプロイする際にコントラクトに0.001ETHを提供
    value: ethers.utils.parseEther("0.001")
  });

  // コントラクトに資金が提供されてデプロイ完了されるのを待つ。
  const waverPortal = await waveContract.deployed();


  console.log("Contract deployed to: ", waverPortal.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();