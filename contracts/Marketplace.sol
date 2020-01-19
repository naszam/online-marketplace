pragma solidity 0.5.16;

/// @title Marketplace, a contract to manage store owners
/// @author Nazzareno Massari
/// @notice Admins of the Marketplace can use this contract to manage store owners to add stores to the Marketplace
/// @dev Admins are responsible for assigning and removing store owners
/// @dev All function calls are currently implemented without side effecs through TDD approach
/// @dev OpenZeppelin library is used for secure contract development
import "./Adminable.sol";

contract Marketplace is Adminable {

  /// State variable
  mapping (address => bool) private storeOwners;

  /// Events
  event StoreOwnerAdded(address indexed storeOwner);
  event StoreOwnerRemoved(address indexed storeOwner);

  /// Modifiers
  modifier onlyStoreOwner() {
      require(isStoreOwner(msg.sender), "Caller is not a Store Owner");
      _;
  }

  /// @notice Check if the address is a Store Owner
  /// @dev Used in onlyStoreOwner() modifier
  /// @param account Address to check
  /// @return True is the account address is a Store Owner
  function isStoreOwner(address account)
    public
    view
    whenNotPaused()
    returns(bool)
  {
    return storeOwners[account];
  }

  /// @notice Add a new Store Owner
  /// @param StoreOwner address of the new Store Owner
  /// @return True if the storeOwner address is added as Store Owner
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

  /// @notice Remove a Store Owner
  /// @param storeOwner Store owner address to remove
  /// @return True if the storeOwner address is removed as Store Owner
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
