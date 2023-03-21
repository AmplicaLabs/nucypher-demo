async function deployContract() {
    const SimpleGroupContract = await ethers.getContractFactory("SimpleGroupsMngmt")
    const simpleGroupContract = await SimpleGroupContract.deploy()
    await simpleGroupContract.deployed()
    // This solves the bug in Mumbai network where the contract address is not the real one
    const txHash = simpleGroupContract.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
   }
   
   deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });