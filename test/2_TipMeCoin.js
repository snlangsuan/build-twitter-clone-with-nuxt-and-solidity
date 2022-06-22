const expect  = require('chai').expect
const ethers = require('hardhat').ethers

describe('TipMe Coin', function() {
  before(async function() {
    const TipMeCoin = await ethers.getContractFactory('TipMeCoin')
    const address = await ethers.getSigners()
    this.owner = address[0]
    this.addr1 = address[1]
    this.tipmecoin = await TipMeCoin.deploy()
  })

  describe('Mint token', function() {
    it('should assign the total supply of tokens to the owner', async function() {
      const ownerBalance = await this.tipmecoin.balanceOf(this.owner.address)
      const supply = await this.tipmecoin.totalSupply()
      expect(supply.toString()).to.equal(ownerBalance.toString())
    })

    it('should assign to other user not owner', async function() {
      // console.log(ethers.utils.parseUnits('100.0', 'ether'))
      const amount = ethers.utils.parseUnits('100.0', 'ether')
      await this.tipmecoin.mint(this.addr1.address, amount)
      const after = await this.tipmecoin.balanceOf(this.addr1.address)
      expect(after.toString()).to.equal(amount.toString())
    })
  })

  describe('Pause Transfer', function() {
    it ('should transfer token and error reverts', async function() {
      const paused = await this.tipmecoin.paused()
      expect(paused).to.equal(false)
      await this.tipmecoin.pause()
      expect(await this.tipmecoin.paused()).to.equal(true)
      const amount = ethers.utils.parseUnits('100.0', 'ether')
      try {
        await this.tipmecoin.transfer(this.addr1.address, amount)
      } catch (error) {
        const msg = error.message
        const isPaused = /Pausable: paused/.test(msg)
        expect(isPaused).to.equal(true)
      }
    })

    it('should transfer token and success', async function() {
      const paused = await this.tipmecoin.paused()
      expect(paused).to.equal(true)
      await this.tipmecoin.unpause()
      expect(await this.tipmecoin.paused()).to.equal(false)
      const amount = ethers.utils.parseUnits('100.0', 'ether')
      const beforeOwnerBalance = await this.tipmecoin.balanceOf(this.owner.address)
      const beforeAddr1Balance = await this.tipmecoin.balanceOf(this.addr1.address)
      await this.tipmecoin.transfer(this.addr1.address, amount)
      const ownerBalance = await this.tipmecoin.balanceOf(this.owner.address)
      const addr1Balance = await this.tipmecoin.balanceOf(this.addr1.address)
      expect(ownerBalance.toString()).to.equal(beforeOwnerBalance.sub(amount).toString())
      expect(addr1Balance.toString()).to.equal(beforeAddr1Balance.add(amount).toString())
    })
  })

  describe('Burn token', function() {
    it('should some supply has gone', async function() {
      // const ownerBalance = await this.tipmecoin.balanceOf(this.owner.address)
      const supply = await this.tipmecoin.totalSupply()
      const amount = ethers.utils.parseUnits('100.0', 'ether')
      await this.tipmecoin.burn(amount)
      const current = await this.tipmecoin.totalSupply()
      // console.log(supply, amount)
      expect(current.toString()).to.equal(supply.sub(amount).toString())
    })
  })
})
