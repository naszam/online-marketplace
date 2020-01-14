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
    
})
