pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Admins of the Marketplace can use this contract to manage store owners to add stores to the Marketplace
/// @dev all function calls are tested using Solidity Tests

import "@openzeppelin/contracts/ownership/Ownable.sol";
//import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "./Adminable.sol";

contract Marketplace is Ownable, Adminable {


  mapping (address => bool) storeOwners;

  event StoreOwnerAdded(address indexed storeOwner);
  event StoreOwnerRemoved(address indexed storeOwner);

  constructor() internal {}

  modifier onlyStoreOwner() {
      require(isStoreOwner(msg.sender), "Caller is not a Store Owner");
      _;
  }

  function isStoreOwner(address account)
    public
    view
    returns(bool)
  {
    return storeOwners[account];
  }

  function addStoreOwner (address storeOwner)
    private
    whenNotPaused
    onlyAdmin
  {
    storeOwners[storeOwner] = true;
    emit StoreOwnerAdded(storeOwner);
  }


   function removeStoreOwner (address storeOwner)
    private
    whenNotPaused
    onlyAdmin
   {
     storeOwners[storeOwner] = false;
     emit StoreOwnerRemoved(storeOwner);
   }


}
