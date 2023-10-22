const { network } = require("hardhat")
const {
    developmentConfig,
    DECIMALS,
    INITIAL_PRICE,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId

    if (chainID == 31337) {
        console.log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        console.log("Mocks deployed!")
        log("------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
