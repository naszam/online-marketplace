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

    it("random address should not be able to add an admin", async () => {
      await catchRevert(instance.addAdmin(admin2, {from:random}))
    })

    it("admin should be able to remove an admin", async () => {
      await instance.addAdmin(admin2, {from:admin})
      await instance.removeAdmin(admin2, {from:admin})
      const adminRemoved = await instance.isAdmin(admin2, {from:admin})
      assert.equal(adminRemoved, false, 'only admin can remove admins')
    })

    it("random address should not be able to remove an admin", async () => {
      await instance.addAdmin(admin2, {from:admin})
      await catchRevert(instance.removeAdmin(admin2, {from:random}))
    })

    it("admins should be able to add a store owner", async () => {
      await instance.addStoreOwner(storeOwner2, {from:admin})
      const storeOwnerAdded = await instance.isStoreOwner(storeOwner2, {from:random})
      assert.equal(storeOwnerAdded, true, 'only admins should be able to add a store owner')
    })

    it("random address should not be able to add a store owner", async () => {
      await catchRevert(instance.addStoreOwner(storeOwner2, {from:random}))
    })

    it("admins should be able to remove a store owner", async () => {
      await instance.addStoreOwner(storeOwner2, {from:admin})
      await instance.removeStoreOwner(storeOwner2, {from:admin})
      const storeOwnerRemoved = await instance.isStoreOwner(storeOwner2, {from:random})
      assert.equal(storeOwnerRemoved, false, 'only admins should be able to remove a store owner')
    })

    it("random address should not be able to remove a store owner", async () => {
      await instance.addStoreOwner(storeOwner2, {from:admin})
      await catchRevert(instance.removeStoreOwner(storeOwner2, {from:random}))
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
