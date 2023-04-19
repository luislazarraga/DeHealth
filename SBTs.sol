pragma solidity ^0.8.0;

contract SBTCode {
    mapping(address => uint256) balances;

    function transfer(address recipient, uint256 amount) external returns (bool) {
        require(recipient != address(0), "SBT: transfer to zero address");
        require(amount > 0, "SBT: transfer amount must be greater than zero");
        require(balances[msg.sender] >= amount, "SBT: insufficient balance");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function isValidAddress(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size == 0 && addr != 0;
    }
    
    function transferSecurely(address recipient, uint256 amount, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) external returns (bool) {
        require(isValidAddress(recipient), "SBT: invalid recipient address");
        require(amount > 0, "SBT: transfer amount must be greater than zero");
        require(balances[msg.sender] >= amount, "SBT: insufficient balance");
        require(ecrecover(messageHash, v, r, s) == sbtauthorizer, "SBT: invalid authorization");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
}
