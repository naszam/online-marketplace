let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Marketplace = artifacts.require('./Marketplace')

contract('Marketplace', function(accounts) {

  const owner = accounts[0]
  const admin = accounts[1]
  const admin2 = accounts[2]
  const storeOwner = accounts[3]
  const storeOwner2 = accounts[4]
  const random = accounts[5]


  let instance

  // Before each test I'm going to
  // add an admin from owner that is set as admin when the contract is deployed
  beforeEach(async () => {
    instance = await Marketplace.new()
    await instance.addAdmin(admin, {from:owner})
  })

  // Check that the owner is set as the deploying address
  // Check that the owner is set as admin when the contract is deployed
  describe("Setup", async() => {

      it("OWNER should be set to the deploying address", async() => {
          const ownerAddress = await instance.owner()
          assert.equal(ownerAddress, owner, "the deploying address should be the owner")
      })

      it("Admin should be added when the contract is created", async() => {
          const instance = await Marketplace.new()
          const adminAdded = await instance.isAdmin(owner)

          assert.isTrue(adminAdded, "the owner should be set as admin")
      })
  })
  describe("Functions", () => {

    // Check addStoreOwner() for success when an admin is trying to add a store owner
    // Check addStoreOwner() for sucessfully emit event when the store owner is added
    // Check addStoreOwner() for failure when a random address try to add a store owner
    describe("addStoreOwner()", async () => {
      it("admins should be able to add a store owner", async () => {
        await instance.addStoreOwner(storeOwner2, {from:admin})
        const storeOwnerAdded = await instance.isStoreOwner(storeOwner2, {from:random})
        assert.isTrue(storeOwnerAdded, "only admins should be able to add a store owner")
      })

      it("should emit the appropriate event when a store owner is added", async () => {
        result = await instance.addStoreOwner(storeOwner2, {from:admin})
        assert.equal(result.logs[0].event, "StoreOwnerAdded", "StoreOwnerAdded event not emitted, check addStoreOwner method")
      })

      it("random address should not be able to add a store owner", async () => {
        await catchRevert(instance.addStoreOwner(storeOwner2, {from:random}))
      })
    })

    // Check removeStoreOwner() for success when an admin is trying to remove a store owner
    // Check removeStoreOwner() for sucessfully emit event when a store owner is removed
    // Check removeStoreOwner() for failure when a random address try to remove a store owner
    describe("removeStoreOwner()", async () => {

      it("admins should be able to remove a store owner", async () => {
        await instance.addStoreOwner(storeOwner2, {from:admin})
        await instance.removeStoreOwner(storeOwner2, {from:admin})
        const storeOwnerRemoved = await instance.isStoreOwner(storeOwner2, {from:random})
        assert.isFalse(storeOwnerRemoved, "only admins should be able to remove a store owner")
      })

      it("should emit the appropriate event when a store owner is removed", async () => {
        await instance.addStoreOwner(storeOwner2, {from:admin})
        const result = await instance.removeStoreOwner(storeOwner2, {from:admin})
        assert.equal(result.logs[0].event, "StoreOwnerRemoved", "StoreOwnerRemoved event not emitted, check removeStoreOwner method")
      })

      it("random address should not be able to remove a store owner", async () => {
        await instance.addStoreOwner(storeOwner2, {from:admin})
        await catchRevert(instance.removeStoreOwner(storeOwner2, {from:random}))
      })
    })
  })
})
