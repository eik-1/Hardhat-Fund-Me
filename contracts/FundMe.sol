//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./PriceConverter.sol";

error FundMe__notOwner();

/** @title A crowd funding contract
 * @author Sarthak Rawat
 * @notice This contract is a demo a sample funding project
 * @dev It implements price feed from Chainlink as our library
 */
contract FundMe {
    /* s_ indicates that the variable is gettng stored in the Storage
       i_ indicates that the variable is immutable
    */

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_findAmount;
    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__notOwner();
        }
        _; // This represents the rest of the code in the function the modifier is used in
    }

    //constructor
    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /** @notice This function funds this contract
     * @dev This implements price feed as our library
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough!"
        );
        s_funders.push(msg.sender);
        s_findAmount[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < s_funders.length; ++i) {
            address funder = s_funders[i];
            s_findAmount[funder] = 0; //Resetting the Mapping
        }
        s_funders = new address[](0); //Resetting the Array

        //Transfering the amount to the owner
        (bool successCall, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(successCall, "Error in withdrawing");
    }

    //Using gas optimization for cheaper withdraw
    function cheaperWithdraw() public payable {
        address[] memory funders = s_funders; //Using the array stored in memory
        //Mappings can't be stored in memory
        for (uint256 i = 0; i < funders.length; ++i) {
            address funder = funders[i];
            s_findAmount[funder] = 0;
        }
        s_funders = new address[](0); //Resetting the Array

        //Transfering the amount to the owner
        (bool successCall, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(successCall, "Error in withdrawing");
    }

    /**@notice The functions below are getter functions for private variables
     * @dev These functions are used to get the values of private variables
     */
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 i) public view returns (address) {
        return s_funders[i];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_findAmount[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
