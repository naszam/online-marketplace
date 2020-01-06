pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Admins of the Marketplace can use this contract to manage store owners to add stores to the Marketplace
/// @dev all function calls are tested using Solidity Tests

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable";
import "./Adminable.sol"

contract Marketplace is Ownable, Pausable, Adminable {




}
