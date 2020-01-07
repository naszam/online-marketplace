pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Store owners can use this contract to manage store's inventory and funds
/// @dev All function calls are tested using Solidity Tests

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable";

contract Stores is Ownable, Pausable {

  uint storeId = 0;
  mapping (uint => Store) private store;
  mapping (uint => Item) private item;

  struct Store {
    uint id;
    string name;
    address owner;
    uint balance;
  }

  struct Item {
    uint sku;
    string name;
    uint price;
    bool purchased;
    uint quantity;
    uint storeId;
  }

  event StoreAdded(uint id);
  event StoreRemoved(uint id);
  event BalanceWithdrawal(address owner, uint balance);
  event ItemAdded(uint sku, uint storeId);
  event ItemRemoved(uint suk, uint storeId);
  event ItemPurchased(uint sku, uint storeId);

  modifier onlyStoreOwner(uint storeId) {
    require();
    _;
  }
  function AddStore(string _name, address _owner, uint _balance)
    public
    onlyStoreOwner(storeId)
    whenNotPaused
    returns (bool)
  {
    store[id] = Store({id: storeId, name: _name, owner: _owner, balance: _balance});
    emit StoreAdded(uint storeId);
    storeId += 1;
    return true;
  }






}
