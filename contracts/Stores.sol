pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Store owners can use this contract to manage store's inventory and funds
/// @dev All function calls are tested using Solidity Tests

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "./Marketplace.sol";

contract Stores is Ownable, Pausable, Marketplace {

  uint storeId = 0;
  uint skuCount = 0;
  mapping (uint => Store) private store;
  mapping (uint => Item) private item;

 // using address owner as id?
  struct Store {
    uint id;
    string name;
    address payable owner;
    bool isOpen;
    uint balance; // fix balance stores like SimpleBank.sol, mapping (address => uint) balances to keep track of owner balance and withdrawals
  }

  struct Item {
    uint sku;
    string name;
    uint price;
    uint quantity;
    uint storeId;
    bool purchased;
  }

  event StoreOpened(uint id);
  event StoreWithdrawal(uint amount);
  event StoreClosed(uint id);
  event ItemAdded(uint sku, uint storeId);
  event ItemRemoved(uint sku, uint storeId);
  event ItemPurchased(uint sku, uint storeId);


  function openStore(string memory _name, address payable _owner)
    private
    onlyAdmin()
    whenNotPaused
    returns(bool)
  {
    storeOwners[_owner] = true;
    store[storeId] = Store({id: storeId, name: _name, owner: _owner, isOpen:true, balance:0});
    emit StoreOpened(storeId);
    storeId += 1;
    return true;
  }
/*
  function withdrawStore(uint id)
    public
    onlyStoreOwner()
    whenNotPaused
  {
	 
  }
*/
  function closeStore(uint id)
    public
    onlyStoreOwner()
    whenNotPaused
    returns(bool)
  {
	store[id].isOpen = false;
	(bool success, ) = store[id].owner.call.value(store[id].balance)("");
	require(success, "Transfer failed.");
	emit StoreClosed(id);

  }

  function addItem(string memory _name, uint _price, uint _quantity, uint _storeId)
    public
    onlyStoreOwner()
    whenNotPaused
    returns(bool)
  {
	item[skuCount] = Item({sku:skuCount, name:_name, price: _price, quantity: _quantity, storeId: _storeId, purchased:false});
        emit ItemAdded(skuCount, item[skuCount].storeId);
	skuCount += 1;
	return true;
  }

  function removeItem(uint sku)
    public
    onlyStoreOwner()
    whenNotPaused
    returns(bool)
  {
	delete item[sku];
	emit ItemRemoved(sku, item[sku].storeId);
	return true;
  }

  function buyItem(uint sku)
    public
  //  Purchased(sku) implement
  //  paidEnough(sku) implement
    whenNotPaused
    returns(bool)
 {
	(bool success, ) = store[item[sku].storeId].owner.call.value(item[sku].price)("");
	require(success, "Transfer failed.");
	item[sku].purchased = true;
	emit ItemPurchased(sku, item[sku].storeId);
 }

}
