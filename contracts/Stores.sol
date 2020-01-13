pragma solidity ^0.5.0;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Store owners can use this contract to manage store's inventory and funds
/// @dev All function calls are tested using Solidity Tests
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Marketplace.sol";

contract Stores is Marketplace {

  using SafeMath for uint;

  uint storeId = 0;
  uint skuCount = 0;
  mapping (uint => Store) private store;
  mapping (uint => Item) private item;
  mapping (address => uint) private balances;

 // using address owner as id?
  struct Store {
    uint id;
    string name;
    address payable owner;
    bool isOpen;
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
  event StoreBalanceWithdrawal(address storeOwner, uint withdrawAmount, uint newBalance);
  event StoreClosed(uint id);
  event ItemAdded(uint sku, uint storeId);
  event ItemRemoved(uint sku, uint storeId);
  event ItemPurchased(uint sku, uint storeId);

  modifier paidEnough(uint _price) {
    require(msg.value >= _price);
    _;
  }

  modifier checkValue(uint _sku) {
    _;
    uint price = item[_sku].price;
    uint amountToRefund = msg.value.sub(price);
    (bool success, ) = msg.sender.call.value(amountToRefund)("");
    require(success, "Transfer Failed");
  }
  function() external payable {
    revert();
  }

  function getBalance()
    public
    view
    returns (uint)
  {
    return balances[msg.sender];
  }

  function openStore(string memory _name, address payable _owner)
    private
    onlyAdmin()
    whenNotPaused
    returns(bool)
  {
    storeOwners[_owner] = true;
    store[storeId] = Store({id: storeId, name: _name, owner: _owner, isOpen:true});
    balances[_owner] = 0;
    emit StoreOpened(storeId);
    storeId = storeId.add(1);
    return true;
  }

  function withdrawStoreBalance(uint withdrawAmount, uint id)
    public
    onlyStoreOwner()
    whenNotPaused
    returns (uint)
  {
    require(balances[msg.sender] >= withdrawAmount);
    balances[msg.sender] = balances[msg.sender].sub(withdrawAmount);
    (bool success, ) = msg.sender.call.value(withdrawAmount)("");
    require(success, "Transfer failed.");
    emit StoreBalanceWithdrawal(msg.sender, withdrawAmount, balances[msg.sender]);
    return balances[msg.sender];
  }

  function closeStore(uint id)
    public
    onlyStoreOwner()
    whenNotPaused
    returns(bool)
  {
	store[id].isOpen = false;
	(bool success, ) = store[item[id].storeId].owner.call.value(balances[store[item[id].storeId].owner])("");
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
	skuCount = skuCount.add(1);
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
    payable
    paidEnough(sku)
    checkValue(sku)
    whenNotPaused
    returns(bool)
 {
  balances[store[item[sku].storeId].owner] = msg.value;
	item[sku].purchased = true;
	emit ItemPurchased(sku, item[sku].storeId);
 }

}
