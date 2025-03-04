// SPDX-license-indentifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MiToken is ERC20 {
    constructor() ERC20("MiToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}

