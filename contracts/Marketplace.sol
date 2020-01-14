pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Admins of the Marketplace can use this contract to manage store owners to add stores to the Marketplace
/// @dev all function calls are tested using Solidity Tests

import "./Adminable.sol";

contract Marketplace is Adminable {


  mapping (address => bool) storeOwners;

  /// Events
  event StoreOwnerAdded(address indexed storeOwner);
  event StoreOwnerRemoved(address indexed storeOwner);

  /// Modifiers
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

  function addStoreOwner(address storeOwner)
    public
    whenNotPaused()
    onlyAdmin()
    returns(bool)
  {
    storeOwners[storeOwner] = true;
    emit StoreOwnerAdded(storeOwner);
    return true;
  }


   function removeStoreOwner(address storeOwner)
    public
    whenNotPaused()
    onlyAdmin()
    returns(bool)
   {
     storeOwners[storeOwner] = false;
     emit StoreOwnerRemoved(storeOwner);
     return true;
   }


}
