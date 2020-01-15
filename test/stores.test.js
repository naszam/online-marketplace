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

    let instance

    beforeEach(async () => {
      instance = await Stores.new()
      await instance.addAdmin(admin, {from:owner})
      await instance.addStoreOwner(storeOwner, {from:admin})
    })

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

      describe("openStore()", async () => {

        it("store owners should be able to open a store", async () => {
          await instance.openStore(storeName,{from:storeOwner})
          const balance = await instance.getBalance({from:random})
          assert.equal(balance, 0, 'only store owner should be able to open store')
        })

        it("should emit the appropriate event when a store is opened", async () => {
          result = await instance.openStore(storeName, {from:storeOwner})
          assert.equal(result.logs[0].event, "StoreOpened", "StoreOpened event not emitted, check openStore method")
        })

        it("random address should not be able to open a store", async () => {
          await catchRevert(instance.openStore(storeOwner2, {from:random}))
        })

      })

      describe("closeStore()", async () => {
        it("store owners should be able to close a store", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          await instance.closeStore(storeId, {from:storeOwner})
          const balance = await instance.getBalance({from:random})
          assert.equal(balance, 0, 'only store owner should be able to close a store')
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
   })
})
