const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentConfig } = require("../../helper-hardhat-config.js")

if (!developmentConfig.includes(network.name)) {
} else {
    describe("FundMe", function () {
        let fundMe
        let MockV3Aggregator
        let deployer
        const sendValue = ethers.utils.parseEther("25")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            fundMe = await ethers.getContract("FundMe", deployer)
            MockV3Aggregator = await ethers.getContract(
                "MockV3Aggregator",
                deployer
            )
        })
        describe("constructor", function () {
            it("sets the aggregator addresses corrrectly", async () => {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, MockV3Aggregator.address)
            })
        })
        describe("fund", function () {
            it("fails if you don't send enough eth", async () => {
                await expect(fundMe.fund({ value: 0 })).to.be.reverted
            })
            it("updates the amount funded data structure", async () => {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(sendValue.toString(), response.toString())
            })
            it("adds getFunders to array of getFunders", async () => {
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.getFunders(0)
                assert.equal(deployer, funder)
            })
        })
        describe("withdraw", function () {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })
            it("Withdraw ETH from a single founder", async () => {
                //Arrange
                const startFundMeBal = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startDeployerBal = await fundMe.provider.getBalance(
                    deployer
                )

                //Act
                const tx = await fundMe.withdraw()
                const tx_receipt = await tx.wait(1)
                const { gasUsed, effectiveGasPrice } = tx_receipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const endFundMeBal = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const endDeployerBal = await fundMe.provider.getBalance(
                    deployer
                )

                //Assert
                assert.equal(endFundMeBal, 0)
                assert.equal(
                    startFundMeBal.add(startDeployerBal).toString(),
                    endDeployerBal.add(gasCost).toString()
                )
            })
            it("allows us to withdraw with multiple getFunders", async () => {
                //Arrange
                const accounts = await ethers.getSigners() //To get list of accounts from node
                for (let i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(
                        accounts[i] //Connect accounts to fundMe
                    )
                    await fundMeConnectedContract.fund({ value: sendValue })
                }
                const startFundMeBal = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startDeployerBal = await fundMe.provider.getBalance(
                    deployer
                )

                //Act
                const tx = await fundMe.withdraw()
                const tx_receipt = await tx.wait(1)
                const { gasUsed, effectiveGasPrice } = tx_receipt
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endFundMeBal = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const endDeployerBal = await fundMe.provider.getBalance(
                    deployer
                )

                //Assert
                assert.equal(endFundMeBal, 0)
                assert.equal(
                    startFundMeBal.add(startDeployerBal).toString(),
                    endDeployerBal.add(gasCost).toString()
                )
                await expect(fundMe.getFunders(0)).to.be.reverted

                for (i = 0; i < 6; i++) {
                    assert.equal(
                        await fundMe.getAddressToAmountFunded(
                            accounts[i].address
                        ),
                        0
                    )
                }
            })
            it("only allows the owner to withdraw", async () => {
                const accounts = await ethers.getSigners()
                const attacker = accounts[1]
                const attackerConnectedContract = await fundMe.connect(attacker)
                await expect(attackerConnectedContract.withdraw()).to.be
                    .reverted
            })
        })
    })
}
