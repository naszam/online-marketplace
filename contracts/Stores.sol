pragma solidity 0.5.16;

/// @title Online Marketplace
/// @author Nazzareno Massari
/// @notice Store owners can use this contract to manage store's inventory and funds
/// @dev All function calls are tested using Solidity Tests
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Marketplace.sol";

contract Stores is Marketplace {

  using SafeMath for uint;

  uint private storeCount;
  uint private skuCount;
  mapping (uint => Store) private store;
  mapping (uint => mapping (uint => Item)) private item;
  mapping (address => uint) private balances;

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
    bool purchased;
  }

  /// Events
  event StoreOpened(uint storeId);
  event StoreBalanceWithdrawal(address storeOwner, uint withdrawAmount, uint newBalance);
  event StoreClosed(uint storeId);
  event ItemAdded(uint sku, uint storeId);
  event ItemRemoved(uint sku, uint storeId);
  event ItemPurchased(uint sku, uint storeId);

  /// Modifiers
  modifier paidEnough(uint _price) {
    require(msg.value >= _price);
    _;
  }

  modifier checkValue(uint _storeId, uint _sku) {
    _;
    uint price = item[_storeId][_sku].price;
    uint amountToRefund = msg.value.sub(price);
    (bool success, ) = msg.sender.call.value(amountToRefund)("");
    require(success, "Transfer Failed");
  }

  function getBalance()
    public
    view
    whenNotPaused()
    returns (uint)
  {
    return balances[msg.sender];
  }

  function isStoreOpen(uint storeId)
    public
    view
    whenNotPaused()
    returns(bool)
  {
    return store[storeId].isOpen;
  }

  function fetchItem(uint storeId, uint sku)
   public
   view
   whenNotPaused()
   returns(string memory name, uint price, uint quantity, bool purchased)
   {
     name = item[storeId][sku].name;
     price = item[storeId][sku].price;
     quantity = item[storeId][sku].quantity;
     purchased = item[storeId][sku].purchased;
     return (name, price, quantity, purchased);
   }

  function openStore(string memory _name)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
    store[storeCount] = Store({id: storeCount, name: _name, owner: msg.sender, isOpen:true});
    balances[msg.sender] = 0;
    emit StoreOpened(storeCount);
    storeCount = storeCount.add(1);
    return true;
  }

  function withdrawStoreBalance(uint withdrawAmount)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns (uint)
  {
    require(balances[msg.sender] >= withdrawAmount && withdrawAmount != 0);
    balances[msg.sender] = balances[msg.sender].sub(withdrawAmount);
    (bool success, ) = msg.sender.call.value(withdrawAmount)("");
    require(success, "Transfer failed.");
    emit StoreBalanceWithdrawal(msg.sender, withdrawAmount, balances[msg.sender]);
    return balances[msg.sender];
  }

  function closeStore(uint storeId)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
	store[storeId].isOpen = false;
	(bool success, ) = store[storeId].owner.call.value(balances[store[storeId].owner])("");
  require(success, "Transfer failed.");
	emit StoreClosed(storeId);
  }

  function addItem(string memory _name, uint _price, uint _quantity, uint _storeId)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
	item[_storeId][skuCount] = Item({sku:skuCount, name:_name, price: _price, quantity: _quantity, purchased:false});
  emit ItemAdded(skuCount, _storeId);
	skuCount = skuCount.add(1);
	return true;
  }

  function removeItem(uint storeId, uint sku)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
	delete item[storeId][sku];
	emit ItemRemoved(storeId, sku);
	return true;
  }

  function buyItem(uint storeId, uint sku, uint quantity)
    public
    payable
    paidEnough(item[storeId][sku].price)
    checkValue(storeId, sku)
    whenNotPaused()
    returns(bool)
 {
  balances[store[storeId].owner] = balances[store[storeId].owner].add(msg.value);
  item[storeId][sku].quantity = item[storeId][sku].quantity.sub(quantity);
	item[storeId][sku].purchased = true;
	emit ItemPurchased(storeId, sku);
 }

}
