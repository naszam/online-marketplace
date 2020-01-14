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

      describe("addAdmin()", async () => {

        it("admins should be able to add an admin", async () => {
          await instance.addAdmin(admin2, {from:admin})
          const adminAdded = await instance.isAdmin(admin2, {from:random})
          assert.isTrue(adminAdded, 'only admin can add new admins')
        })

        it("random address should not be able to add an admin", async () => {
          await catchRevert(instance.addAdmin(admin2, {from:random}))
        })

        it("should emit the appropriate event when an admin is added", async () => {
          const result = await instance.addAdmin(admin2, {from:admin})
          assert.equal(result.logs[0].event, "AdminAdded", "AdminAdded event property not emitted, check addAmdin method")
        })
      })

      describe("removeAdmin()", async () => {

        it("admins should be able to remove an admin", async () => {
          await instance.addAdmin(admin2, {from:admin})
          await instance.removeAdmin(admin2, {from:admin})
          const adminRemoved = await instance.isAdmin(admin2, {from:admin})
          assert.isFalse(adminRemoved, 'only admin can remove admins')
        })

        it("should emit the appropriate event when an admin is removed", async () => {
          await instance.addAdmin(admin2, {from:admin})
          const result = await instance.removeAdmin(admin2, {from:admin})
          assert.equal(result.logs[0].event, "AdminRemoved", "AdminRemoved event property not emitted, check removeAmdin method")
        })

        it("random address should not be able to remove an admin", async () => {
          await instance.addAdmin(admin2, {from:admin})
          await catchRevert(instance.removeAdmin(admin2, {from:random}))
        })
      })

      describe("addStoreOwner()", async () => {
        it("admins should be able to add a store owner", async () => {
          await instance.addStoreOwner(storeOwner2, {from:admin})
          const storeOwnerAdded = await instance.isStoreOwner(storeOwner2, {from:random})
          assert.isTrue(storeOwnerAdded, 'only admins should be able to add a store owner')
        })

        it("should emit the appropriate event when a store owner is added", async () => {
          result = await instance.addStoreOwner(storeOwner2, {from:admin})
          assert.equal(result.logs[0].event, "StoreOwnerAdded", "StoreOwnerAdded event property not emitted, check addStoreOwner method")
        })

        it("random address should not be able to add a store owner", async () => {
          await catchRevert(instance.addStoreOwner(storeOwner2, {from:random}))
        })
      })

      describe("removeStoreOwner()", async () => {

        it("admins should be able to remove a store owner", async () => {
          await instance.addStoreOwner(storeOwner2, {from:admin})
          await instance.removeStoreOwner(storeOwner2, {from:admin})
          const storeOwnerRemoved = await instance.isStoreOwner(storeOwner2, {from:random})
          assert.isFalse(storeOwnerRemoved, 'only admins should be able to remove a store owner')
        })

        it("should emit the appropriate event when a store owner is removed", async () => {
          await instance.addStoreOwner(storeOwner2, {from:admin})
          const result = await instance.removeStoreOwner(storeOwner2, {from:admin})
          assert.equal(result.logs[0].event, "StoreOwnerRemoved", "StoreOwnerRemoved event property not emitted, check removeStoreOwner method")
        })

        it("random address should not be able to remove a store owner", async () => {
          await instance.addStoreOwner(storeOwner2, {from:admin})
          await catchRevert(instance.removeStoreOwner(storeOwner2, {from:random}))
        })
      })

      describe("openStore()", async () => {

        it("store owners should be able to open a store", async () => {
          await instance.openStore(storeName,{from:storeOwner})
          const balance = await instance.getBalance({from:random})
          assert.equal(balance, 0, 'only store owner should be able to open store')
        })

        it("should emit the appropriate event when a store is opened", async () => {
          result = await instance.openStore(storeName, {from:storeOwner})
          assert.equal(result.logs[0].event, "StoreOpened", "StoreOpened event property not emitted, check openStore method")
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
          assert.equal(result.logs[0].event, "StoreClosed", "StoreClosed event property not emitted, check closeStore method")
        })

        it("random address should not be able to close a store", async () => {
          await instance.openStore(storeName, {from:storeOwner})
          await catchRevert(instance.closeStore(storeId, {from:random}))
        })

      })
 })

})
