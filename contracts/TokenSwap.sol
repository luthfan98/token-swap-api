// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function swap(address _tokenIn, address _tokenOut, uint256 _amountIn, address _receiver) external {
        require(_amountIn > 0, "Amount must be greater than zero");

        // Transfer token dari pengirim ke kontrak ini
        require(IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn), "Transfer failed");

        // Transfer token yang ditukar ke penerima
        require(IERC20(_tokenOut).transfer(_receiver, _amountIn), "Transfer failed");
    }
}
