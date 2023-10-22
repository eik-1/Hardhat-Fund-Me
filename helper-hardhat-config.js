const networkConfig = {
    4: {
        name: "rinkeby",
        ethUSDPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    11155111: {
        name: "sepolia",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    137: {
        name: "polygon",
        ethUSDPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}

const developmentConfig = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_PRICE = 200000000000

module.exports = {
    networkConfig,
    developmentConfig,
    DECIMALS,
    INITIAL_PRICE,
}
