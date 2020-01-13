pragma solidity >= 0.5.0 < 0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Stores.sol";



contract Proxy {

  // the proxied Stores contract
	Stores public stores;

  /// @notice Create a Proxy
  /// @param _target the Stores to interact with
  constructor(Stores _target) public {
    stores = _target;
  }

  /// Allow contract to receive ether
	function() external payable {}

  /// @notice Retrieve stores contract
	/// @return the stores contract
	function getTarget()
		public
    view
		returns(Stores)
	{
		return stores;
	}

  /// @notice Add Store Owner
  /// @param _owner the address to add as store owner
  function addStoreOwner(address _owner)
    public
    returns(bool)
  {
    (bool success, ) = address(stores).call(abi.encodeWithSignature("addStoreOwner(address), _owner"));
    return success;
  }

  /// @notice Return store balances
  /// @return the store balance
  function getBalance()
    public
    view
    returns(bool)
  {
    (bool success, ) = address(stores).call(abi.encodeWithSignature("getBalance()"));
    return success;
  }

  /// @notice Open Store
  /// @param _name Name of the store
  /// @param _owner Owner of the store
  function openStore(string memory _name)
    public
    returns(bool)
  {
    (bool success, ) = address(stores).call(abi.encodeWithSignature("openStore(string memory)", _name));
    return success;
  }
}
