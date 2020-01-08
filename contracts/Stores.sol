pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Store owners can use this contract to manage store's inventory and funds
/// @dev All function calls are tested using Solidity Tests

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable";
import "./Marketplace.sol";

contract Stores is Ownable, Pausable, Marketplace {

  uint storeId = 0;
  mapping (uint => Store) private store;
  mapping (uint => Item) private item;

 // using address owner as id?
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
    uint quantity;
    uint storeId;
    bool purchased;
  }

  event StoreAdded(uint id);
  event StoreRemoved(uint id);
  event ItemAdded(uint sku, uint storeId);
  event ItemRemoved(uint sku, uint storeId);
  event ItemPurchased(uint sku, uint storeId);

  modifier onlyStoreOwner(uint storeId) {
    require();
    _;
  }

  function addStore(string memory _name, address _owner, uint _balance)
    public
    onlyStoreOwner(storeId)
    whenNotPaused
    returns(bool)
  {
    store[id] = Store({id: storeId, name: _name, owner: _owner, balance: _balance});
    emit StoreAdded(storeId);
    storeId += 1;
    return true;
  }

  function removeStore(uint id)
    public
    onlyStoreOwner(storeId)
    whenNotPaused
    returns(bool)
  {
    emit StoreRemoved(id);
  }

  function addItem(string memory _name, uint price, uint quantity, uint storeId)
    public
    onlyStoreOwner(storeId)
    whenNotPaused
    returns(bool)
  {
    emit ItemAdded(sku, storeId);
  }

  function removeItem(uint sku)
    public
    onlyStoreOwner(storeId)
    whenNotPaused
    returns(bool)
  {
    emit ItemRemoved(sku, storeId);
  }

  function buyItem(uint sku)
    public
    whenNotPaused
    returns(bool)
 {
   emit ItemPurchased(sku);
 }

}
