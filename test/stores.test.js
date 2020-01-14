let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Stores = artifacts.require('./Stores')

contract('Stores', function(accounts) {

    const owner = accounts[0]
    const admin = accounts[1]
    const storeOwner = accounts[2]
    const admin2 = accounts[3]
    const storeOwner2 = accounts[4]
    const buyer = accounts[5]
    const random = accounts[6]

    const storeName = "testName"
    const itemPrice = 3
    const storeId = 0
    const itemSku = 0
    const testAmount = 3

    beforeEach(async () => {
      instance = await Stores.new()
      await instance.addAdmin(admin, {from:owner})
      await instance.addStoreOwner(storeOwner, {from:admin})
    })

    it("admin should be able to add an admin", async () => {
      await instance.addAdmin(admin2, {from:admin})
      const adminAdded = await instance.isAdmin(admin2, {from:random})
      assert.equal(adminAdded, true, 'only admin can add new admins')
    })

    it("admins should be able to add a store owner", async () => {
      await instance.addStoreOwner(storeOwner2, {from:admin})
      const storeOwnerAdded = await instance.isStoreOwner(storeOwner2, {from:random})
      assert.equal(storeOwnerAdded, true, 'only admins should be able to add a store owner')
    })

    it("store owner should be able to open a store", async () => {
      await instance.openStore(storeName,{from:storeOwner})
      const balance = await instance.getBalance({from:random})
      assert.equal(balance, 0, 'only store owner should be able to open store')
    })

    it("store owner should be able to close a store", async () => {
      await instance.openStore(storeName, {from:storeOwner})
      await instance.closeStore(storeId, {from:storeOwner})
      const balance = await instance.getBalance({from:random})
      assert.equal(balance, 0, 'only store owner should be able to close a store')
    })



})
