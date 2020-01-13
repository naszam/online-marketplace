pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Stores.sol";
import "./Proxy.sol";

contract TestStores {

    uint public initialBalance = 1 ether;

    Stores public stores;
    Proxy public adminProxy;
    Proxy public storeOwnerProxy;
    Proxy public buyerProxy;
    Proxy public randomProxy;

    string storeName = "testName";
    uint itemPrice = 3;
    uint storeId = 0;
    uint itemSku = 0;

    // allow contract to receive ether
    function () external payable {}

    function beforeEach() public {

    // contract to test
        stores = new Stores();
        storeOwnerProxy = new Proxy(stores);
        buyerProxy = new Proxy(stores);
        randomProxy = new Proxy(stores);

    // seed buyers with some funds (in WEI)
      uint256 seedValue = itemPrice + 1;
      address(buyerProxy).transfer(seedValue);

      stores.addStoreOwner(address(storeOwnerProxy));

    }

    function testForFailureIfNotStoreOwner () public {
      bool result = randomProxy.openStore(storeName);
      Assert.isFalse(result, "Not StoreOwner should not be allowed to Open a Store.");
    }
  }
