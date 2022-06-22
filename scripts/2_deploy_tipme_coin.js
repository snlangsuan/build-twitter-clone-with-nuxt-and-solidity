const ethers = require('hardhat').ethers
async function main() {
  try {
    const tipMeContractFactory = await ethers.getContractFactory('TipMeCoin')
    const tipmeCoin = await tipMeContractFactory.deploy()
    await tipmeCoin.deployed()
    console.log('TipMeCoin Contract deployed to:', tipmeCoin.address)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
