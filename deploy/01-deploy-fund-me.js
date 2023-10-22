const { networkConfig, developmentConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    let wait
    const chainID = network.config.chainId

    log("Deploying Contract ...")
    if (developmentConfig.includes(network.name)) {
        const ethUSDAggregator = await get("MockV3Aggregator")
        ethUSDPriceFeedAddress = ethUSDAggregator.address
        wait = false
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainID]["ethUSDPriceFeed"]
        wait = true
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUSDPriceFeedAddress],
        log: true,
        waitConfirmations: wait ? network.config.blockConfirmations : undefined,
    })
    log("Contract Deployed!!")
    log("------------------------------------------------------")

    if (
        !developmentConfig.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        log("Verifying Contract on Etherscan ...")
        await verify(fundMe.address, [ethUSDPriceFeedAddress])
        log("Contract Verified!!")
        log("------------------------------------------------------")
    }
}

module.exports.tags = ["all", "FundMe"]
