const ethers = require('hardhat').ethers
async function main() {
  try {
    const twitterContractFactory = await ethers.getContractFactory('TwitterContract')
    const twitterContract = await twitterContractFactory.deploy()
    await twitterContract.deployed()
    console.log('Twitter Contract deployed to:', twitterContract.address)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
