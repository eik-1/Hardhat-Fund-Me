require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = [process.env.SEPOLIA_PRIVATE_KEY]
const ETHERSCAN_API = process.env.ETHERSCAN_API
const COINMARKET_API = process.env.COINMARKET_API

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.19" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: SEPOLIA_PRIVATE_KEY,
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        ouputFile: "gas-reporter.txt",
        currency: "USD",
        coinmarketcap: COINMARKET_API,
        noColors: true,
    },
    paths: {
        deploy: "deploy",
        deployments: "deployments",
    },
}
