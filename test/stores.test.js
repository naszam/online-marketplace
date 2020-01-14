let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Stores = artifacts.require('./Stores')

contract('Stores', function(accounts) {

    const owner = accounts[0]
    const admin = accounts[1]
    const storeOwner = accounts[2]

    const storeName = "testName"
    const itemPrice = 3
    const storeId = 0
    const itemSku = 0

    beforeEach(async () => {
      instance = await Stores.new()
    })

    it("owner should be added as Admin and able to add store owner", async () => {
      await instance.isAdmin(owner,{from:owner})
      const ownerAdded = await instance.addStoreOwner(storeOwner, {from:admin})
      assert.equal(ownerAdded, storeOwner, 'only admin should be able to add store owners')
    })
})
