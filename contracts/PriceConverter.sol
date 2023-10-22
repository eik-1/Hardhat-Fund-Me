//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; //npm-package

library PriceConverter {
    //function to get the real time price of ethereum
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //ABI
        //Address = 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); //price is ETH in USD
    }

    //function to get the conversion rate of Ethereum
    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUSD = (ethAmount * ethPrice) / 1e18;
        return ethAmountInUSD;
    }
}
