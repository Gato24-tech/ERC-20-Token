// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

        function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        emit Approval(msg.sender, spender, amount);  //<-- Emitimos el evento de aprobación
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        uint256 currentAllowance = allowance(sender, msg.sender);
        require(currentAllowance >= amount, "Allowance insuficiente");
        _approve(sender, msg.sender, currentAllowance - amount);
        return true;
    }
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    _approve(msg.sender, spender, allowance(msg.sender, spender) + addedValue);
    return true;
}

function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    uint256 currentAllowance = allowance(msg.sender, spender);
    require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
    _approve(msg.sender, spender, currentAllowance - subtractedValue);
    return true;
}

}
