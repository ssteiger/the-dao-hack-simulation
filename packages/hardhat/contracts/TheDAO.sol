// SPDX-License-Identifier: MIT

// simplified DAO Contract

pragma solidity 0.7.0;

contract TheDAO {
  event Investment(address indexed investor, uint256 indexed amount);
  event Withdrawal(address indexed to, uint256 indexed amount);

  mapping(address => uint256) private balances;

  function invest(address _to) public payable {
    balances[_to] += msg.value;
    emit Investment(_to, msg.value);
  }

  function balanceOf(address _who) public view returns (uint256 balance) {
    return balances[_who];
  }

  function withdraw(uint256 _amount) public {
    if (balances[msg.sender] >= _amount) {
      (bool result, bytes memory data) = msg.sender.call{value: _amount}("");
      if (result) {
        _amount;
      }
      balances[msg.sender] -= _amount;

      emit Withdrawal(msg.sender, _amount);
    }
  }

  fallback() external payable {}
}
