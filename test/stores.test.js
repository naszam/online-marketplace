var Adminable = artifacts.require('Adminable')
var Marketplace = artifacts.require('Marketplace')
var Stores = artifacts.require('Stores')
let catchRevert = require("./exceptionsHelpers.js").catchRevert
const BN = web3.utils.BN

contract('Stores', function(accounts) {

    const firstAccount = accounts[0]
    const secondAccount = accounts[1]
    const thirdAccount = accounts[2]

    const storeName = "testName"
    const itemPrice = 3
    const storeId = 0
    const itemSku = 0


    describe("Setup", async() => {

        it("Admin should be set to the deploying address", async() => {
            const admin = await instance.owner()
            assert.equal(admin, firstAccount, "the deploying address should be the owner")
        })
    })

    describe("Functions", () => {

   })
})
