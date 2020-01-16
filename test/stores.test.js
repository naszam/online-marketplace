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

    const storeName = "testStoreName"
    const itemName = "testItemName"
    const itemPrice = 3
    const itemQuantity = 5
    const storeId = 0
    const itemSku = 0
    const testAmount = 3

    let instance

    // Before each test I'm going to
    // add an admin from owner that is set as admin when the contract is deployed
    // add a store owner using the admin account just added
    beforeEach(async () => {
      instance = await Stores.new()
      await instance.addAdmin(admin, {from:owner})
      await instance.addStoreOwner(storeOwner, {from:admin})
    })

    // Check that the owner is set as the deploying address
    // Check that the owner is set as admin when the contract is deployed
    describe("Setup", async() => {

        it("OWNER should be set to the deploying address", async() => {
            const ownerAddress = await instance.owner()
            assert.equal(ownerAddress, owner, "the deploying address should be the owner")
        })

        it("Admin should be added when the contract is created", async() => {
            const instance = await Stores.new()
            const adminAdded = await instance.isAdmin(owner)

            assert.isTrue(adminAdded, "the owner should be set as admin")
        })
    })

    describe("Functions", () => {

      // Check openStore() for success when a store owner is trying to open a store
      // Check openStore() for sucessfully emit event when the store is opened
      // Check openStore() for failure when a random address try to open a store
      describe("openStore()", async () => {

        it("store owners should be able to open a store", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          const storeOpened = await instance.isStoreOpen(storeId, {from:random})
          assert.isTrue(storeOpened, "only store owner should be able to open store")
        })

        it("should emit the appropriate event when a store is opened", async () => {
          result = await instance.openStore(storeName, {from:storeOwner})
          assert.equal(result.logs[0].event, "StoreOpened", "StoreOpened event not emitted, check openStore method")
        })

        it("random address should not be able to open a store", async () => {
          await catchRevert(instance.openStore(storeOwner2, {from:random}))
        })

      })

      // Check closeStore() for success when a store owner is trying to close a store
      // Check closeStore() for sucessfully emit event when the store is closed
      // Check closeStore() for failure when a random address try to close a store
      describe("closeStore()", async () => {
        it("store owners should be able to close a store", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          await instance.closeStore(storeId, {from:storeOwner})
          const storeOpened = await instance.isStoreOpen(storeId, {from:random})
          assert.isFalse(storeOpened, "only store owner should be able to close a store")
        })

        it("should emit the appropriate event when a store is closed", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          const result = await instance.closeStore(storeId, {from:storeOwner})
          assert.equal(result.logs[0].event, "StoreClosed", "StoreClosed event not emitted, check closeStore method")
        })

        it("random address should not be able to close a store", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          await catchRevert(instance.closeStore(storeId, {from:random}))
        })

      })

      // Check addItem() for success when a store owner is trying to add an item
      // Check addItem() for sucessfully emit event when an item is added
      // Check addItem() for failure when a random address try to add an item
      describe("addItem()", async () => {
        it("store owners should be able to add an Item", async () => {
          await instance.openStore(storeName,{from:storeOwner})
          await instance.addItem(itemName, itemPrice, itemQuantity, storeId, {from:storeOwner})
          result = await instance.fetchItem(storeId, itemSku, {from:random})
          assert.equal(result[0], itemName, "the name of the last added item does not match the expected value")
          assert.equal(result[1], itemPrice, "the price of the last added item does not match the expected value")
          assert.equal(result[2], itemQuantity, "the quantinty of the last added item does not match the expected value")
          assert.isFalse(result[3], 'the purchased state of item should be set on 0')
        })

        it("should emit the appropriate event when an item is added", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          result = await instance.addItem(itemName, itemPrice, itemQuantity, storeId, {from:storeOwner})
          assert.equal(result.logs[0].event, "ItemAdded", "ItemAdded event not emitted, check addItem method")
        })

        it("random address should not be able to add an item", async () => {
          await instance.openStore(storeOwner2, {from:storeOwner})
          await catchRevert(instance.addItem(itemName, itemPrice, itemQuantity, storeId, {from:random}))
        })

      })
   })
})
