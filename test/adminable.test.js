let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Adminable = artifacts.require('./Adminable')

contract('Adminable', function(accounts) {

  const owner = accounts[0]
  const admin = accounts[1]
  const admin2 = accounts[2]
  const random = accounts[3]


  let instance

  beforeEach(async () => {
    instance = await Adminable.new()
    await instance.addAdmin(admin, {from:owner})
  })

  describe("Setup", async() => {

      it("OWNER should be set to the deploying address", async() => {
          const ownerAddress = await instance.owner()
          assert.equal(ownerAddress, owner, "the deploying address should be the owner")
      })

      it("Admin should be added when the contract is created", async() => {
          const instance = await Adminable.new()
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
        assert.equal(result.logs[0].event, "AdminAdded", "AdminAdded event not emitted, check addAmdin method")
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
        assert.equal(result.logs[0].event, "AdminRemoved", "AdminRemoved event not emitted, check removeAmdin method")
      })

      it("random address should not be able to remove an admin", async () => {
        await instance.addAdmin(admin2, {from:admin})
        await catchRevert(instance.removeAdmin(admin2, {from:random}))
      })
    })
  })
})
