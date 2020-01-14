let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Stores = artifacts.require('./Stores')

contract('Stores', function(accounts) {

    const owner = accounts[0]
    const admin = accounts[1]
    const storeOwner = accounts[2]
    const buyer = accounts[3]

    const storeName = "testName"
    const itemPrice = 3
    const storeId = 0
    const itemSku = 0

    beforeEach(async () => {
      instance = await Stores.new()
      await instance.addAdmin(admin, {from:owner})
      await instance.addStoreOwner(storeOwner, {from:admin})
    })

    it("should open a store", async () => {
      await instance.openStore(storeName,{from:storeOwner})
      const balance = await instance.getBalance({from:storeOwner})
      assert.equal(balance, 0, 'only store owner should be able to open store')
    })
})
