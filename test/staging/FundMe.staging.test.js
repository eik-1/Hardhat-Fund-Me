const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentConfig } = require("../../helper-hardhat-config.js")
const { assert } = require("chai")

if (developmentConfig.includes(network.name)) {
} else {
    describe("FundMe", function () {
        let fundMe
        let deployer
        let sendValue = ethers.utils.parseEther("0.1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })
        it("should be able to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue })
            await fundMe.withdraw()
            const endingBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            assert.equal(endingBalance.toString(), "0")
        })
    })
}
