pragma solidity 0.5.16;

/// @title Stores, a contract to manage stores and items
/// @author Nazzareno Massari
/// @notice Store owners can use this contract to manage store's inventory and funds
/// @dev All function calls are currently implemented without side effecs through TDD approach
/// @dev OpenZeppelin library is used for secure contract development
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Marketplace.sol";

contract Stores is Marketplace {

  /// Using OpenZeppelin SafeMath library to revert a transaction when an operation overflows
  using SafeMath for uint;

  /// State variables
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
    bool available;
  }

  /// Events
  event StoreOpened(uint storeId, string storeName);
  event StoreBalanceWithdrawn(address storeOwner, uint withdrawAmount, uint newBalance);
  event StoreClosed(uint storeId, string storeName);
  event ItemAdded(uint sku, uint storeId);
  event ItemRemoved(uint sku, uint storeId);
  event ItemPurchased(uint sku, uint storeId);

  /// Modifiers
  modifier paidEnough(uint _storeId, uint _sku, uint _quantity) {
    require(_quantity > 0, "Error: 0 quantity specified!");
    require(item[_storeId][_sku].quantity >= _quantity, "Error: quantity not available");
    require(msg.value >= item[_storeId][_sku].price.mul(_quantity), "Insufficient funds");
    _;
  }

  modifier checkValue(uint _storeId, uint _sku, uint _quantity) {
    _;
    uint price = item[_storeId][_sku].price;
    uint amountToRefund = msg.value.sub(price.mul(_quantity));
    require(amountToRefund > 0);
    balances[store[_storeId].owner] = balances[store[_storeId].owner].sub(amountToRefund);
    (bool success, ) = msg.sender.call.value(amountToRefund)("");
    require(success, "Transfer Failed");
  }

  /// @notice Getter function for store balance
  /// @dev Access restricted to only Store Owners
  /// @return The store balance of the sender Store Owner
  function getBalance()
    public
    view
    onlyStoreOwner()
    whenNotPaused()
    returns (uint)
  {
    return balances[msg.sender];
  }

  /// @notice Check if the store is open
  /// @dev Used mainly for tests
  /// @param storeId The store Id
  /// @return True if the store is open
  function isStoreOpen(uint storeId)
    public
    view
    whenNotPaused()
    returns(bool)
  {
    return store[storeId].isOpen;
  }

  /// @notice Fectch an Item
  /// @dev Used mainly for tests
  /// @param storeId The store Id
  /// @param sku The sku of the item
  /// @return The name, price, quantity, availability of the item
  function fetchItem(uint storeId, uint sku)
   public
   view
   whenNotPaused()
   returns(string memory name, uint price, uint quantity, bool available)
   {
     name = item[storeId][sku].name;
     price = item[storeId][sku].price;
     quantity = item[storeId][sku].quantity;
     available = item[storeId][sku].available;
     return (name, price, quantity, available);
   }

  /// @notice Open a new store
  /// @param _name The name of the new store
  /// @dev Access restricted only to Store Owners
  /// @return True if store is successfully opened
  function openStore(string memory _name)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
    store[storeCount] = Store({id: storeCount, name: _name, owner: msg.sender, isOpen:true});
    balances[msg.sender] = 0;
    emit StoreOpened(storeCount, store[storeCount].name);
    storeCount = storeCount.add(1);
    return true;
  }

  /// @notice Close a store
  /// @dev Access restricted only to Store Owners
  /// @param storeId The store Id
  /// @return True if the store is successfully closed
  function closeStore(uint storeId)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
	store[storeId].isOpen = false;
	(bool success, ) = store[storeId].owner.call.value(balances[store[storeId].owner])("");
  require(success, "Transfer failed.");
	emit StoreClosed(storeId, store[storeId].name);
	return true;
  }

  /// @notice Add a new item
  /// @dev Access restricted only to Store Owners
  /// @param _name Name of the new item
  /// @param _price Price of the new item
  /// @param _quantity Quantity of the new item
  /// @param _storeId The store Id to reference the store
  /// @return True if the item is successfully added
  function addItem(string memory _name, uint _price, uint _quantity, uint _storeId)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
	item[_storeId][skuCount] = Item({sku:skuCount, name:_name, price: _price, quantity: _quantity, available:true});
  emit ItemAdded(skuCount, _storeId);
	skuCount = skuCount.add(1);
	return true;
  }

  /// @notice Remove an item
  /// @dev Access restricted only to Store Owners
  /// @param storeId The store Id
  /// @param sku The sku of the item
  /// @return True if the item is successfully removed
  function removeItem(uint storeId, uint sku)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns(bool)
  {
  item[storeId][sku].price = 0;
  item[storeId][sku].quantity = 0;
  item[storeId][sku].available = false;
	emit ItemRemoved(storeId, sku);
	return true;
  }

  /// @notice Buy an item
  /// @param storeId The store Id
  /// @param sku The item sku
  /// @param quantity The quantity for the selected item
  /// @return True if the item is successfully bought
  function buyItem(uint storeId, uint sku, uint quantity)
    public
    payable
    paidEnough(storeId, sku, quantity)
    checkValue(storeId, sku, quantity)
    whenNotPaused()
    returns(bool)
 {
    require(item[storeId][sku].available);
    balances[store[storeId].owner] = balances[store[storeId].owner].add(msg.value);
    item[storeId][sku].quantity = item[storeId][sku].quantity.sub(quantity);
    emit ItemPurchased(storeId, sku);
    return true;
 }

  /// @notice Withdraw an amount from the store balance
  /// @dev Access restricted to Store Owners
  /// @param withdrawAmount Amount to withdraw
  /// @return The updated store balance
  function withdrawStoreBalance(uint withdrawAmount)
    public
    onlyStoreOwner()
    whenNotPaused()
    returns (uint)
 {
    require(withdrawAmount != 0, "Error: 0 amount specified!");
    require(balances[msg.sender] >= withdrawAmount, "Error: specified amount not available to withdraw");
    balances[msg.sender] = balances[msg.sender].sub(withdrawAmount);
    (bool success, ) = msg.sender.call.value(withdrawAmount)("");
    require(success, "Transfer failed.");
    emit StoreBalanceWithdrawn(msg.sender, withdrawAmount, balances[msg.sender]);
    return balances[msg.sender];
  }

}
