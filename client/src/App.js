import React, { Component } from "react";
import Stores from "./contracts/Stores.json";
import getWeb3 from "./getWeb3";

import "./App.css";

import { Button, Card, Box, Flex, Form, Input, Heading, Field, Table, EthAddress } from 'rimble-ui';

import NetworkIndicator from "@rimble/network-indicator";

const etherscanBaseUrl = "https://rinkeby.etherscan.io"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      etherscanLink: "https://rinkeby.etherscan.io",
      web3: null,
      accounts: null,
      storesInstance: null,
      value: 0,
      adminAddressToAdd: undefined,
      adminAddressToRemove: undefined,
      ownerAddressToAdd: undefined,
      ownerAddressToRemove: undefined,
      admins:[],
      storeOwners:[],
      storeIds:[],
      storeNames:[],
      storeBalances:[],
      withdrawAmount: undefined,
      itemId: undefined,
      itemName: undefined,
      itemPrice: undefined,
      itemQuantity: undefined,
      itemStoreId: undefined,
      itemAvailability: undefined,
      itemStoreId2Buy: undefined,
      itemId2Buy: undefined,
      itemQuantity2Buy: undefined
    }

    this.handleAddAdmin = this.handleAddAdmin.bind(this)
    this.handleRemoveAdmin = this.handleRemoveAdmin.bind(this)
    this.handleAddStoreOwner = this.handleAddStoreOwner.bind(this)
    this.handleRemoveStoreOwner = this.handleRemoveStoreOwner.bind(this)
    this.handleOpenStore = this.handleOpenStore.bind(this)
    this.handleCloseStore = this.handleCloseStore.bind(this)
    this.handleWithdrawStoreBalance = this.handleWithdrawStoreBalance.bind(this)
    //this.handleBuyItem = this.handleBuyItem.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Stores.networks[networkId];
      const instance = new web3.eth.Contract(
        Stores.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ networkId: networkId, web3: web3, accounts: accounts[0], storesInstance: instance });
      this.listenAdminAddedEvent()
      this.listenAdminRemovedEvent()
      this.listenStoreOwnerAddedEvent()
      this.listenStoreOwnerRemovedEvent()
      this.listenStoreOpenedEvent()
      this.listenStoreCloseEvent()
      this.listenItemAddedEvent()
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenAdminAddedEvent=() => {

    this.state.storesInstance.events.AdminAdded({fromBlock: 0})
    .on('data', async (event) => {
      this.setState(prevState => {
      var newAdminsArray = prevState.admins;
      console.log(JSON.stringify(newAdminsArray), event.returnValues.admin)

      if (!newAdminsArray.includes(event.returnValues.admin)){
      newAdminsArray.push(event.returnValues.admin)
      }
      return {
        ...prevState,
        admins: newAdminsArray
      }

    })
  })
    .on('error', console.error);
  }

  listenAdminRemovedEvent=() => {

    this.state.storesInstance.events.AdminRemoved({fromBlock: 0})
    .on('data', async (event) => {

      var newAdminsArray = this.state.admins
      console.log("remove", JSON.stringify(newAdminsArray), event.returnValues.admin)

      if (newAdminsArray.includes(event.returnValues.admin)){
      var index=newAdminsArray.indexOf(event.returnValues.admin)
      newAdminsArray.splice(index, 1)
      this.setState({ admins: newAdminsArray })
      }

    })
    .on('error', console.error);
  }

  listenStoreOwnerAddedEvent=() => {
    this.state.storesInstance.events.StoreOwnerAdded({fromBlock: 0})
    .on('data', async (event) => {
  	  this.setState(prevState => {
  		 var newStoreOwnersArray = prevState.storeOwners;
  		if (!newStoreOwnersArray.includes(event.returnValues.storeOwner)){
  		  newStoreOwnersArray.push(event.returnValues.storeOwner)
  		}
  		return {
  			...prevState,
  			storeOwners: newStoreOwnersArray
  		}
  	  })
    })
      .on('error', console.error);
    }


  listenStoreOwnerRemovedEvent=() => {

    this.state.storesInstance.events.StoreOwnerRemoved({fromBlock: 0})
    .on('data', async (event) => {
      var newStoreOwnersArray = this.state.storeOwners

      if (newStoreOwnersArray.includes(event.returnValues.storeOwner)){
      var index=newStoreOwnersArray.indexOf(event.returnValues.storeOwner)
      newStoreOwnersArray.splice(index, 1)
      this.setState({ storeOwners: newStoreOwnersArray })
      }

    })
    .on('error', console.error);
  }

  listenStoreOpenedEvent=() => {

    this.state.storesInstance.events.StoreOpened({fromBlock: 0})
    .on('data', async (event) => {

      var newStoreIdArray = this.state.storeIds
      var newStoreNameArray = this.state.storeNames
      var newStoreBalanceArray = this.state.storeBalances


      if (!newStoreIdArray.includes(event.returnValues.storeId) && !newStoreNameArray.includes(event.returnValues.storeName) && !newStoreBalanceArray.includes(event.returnValues.storeBalance)){
      newStoreIdArray.push(event.returnValues.storeId)
      newStoreNameArray.push(event.returnValues.storeName)
      newStoreBalanceArray.push(event.returnValues.storeBalance)
      this.setState({ storeIds: newStoreIdArray, storeNames: newStoreNameArray, storeBalances: newStoreBalanceArray })
      }

    })
    .on('error', console.error);
  }

  listenStoreClosedEvent=() => {

    this.state.storesInstance.events.StoreClosed({fromBlock: 0})
    .on('data', async (event) => {

      var newStoreIdArray = this.state.storeIds
      var newStoreNameArray = this.state.storeNames

      if (newStoreIdArray.includes(event.returnValues.storeId) && newStoreNameArray.includes(event.returnValues.storeName)){
      var indexStoreId=newStoreIdArray.indexOf(event.returnValues.storeId)
      newStoreIdArray.splice(indexStoreId, 1)
      var indexStoreName=newStoreNameArray.indexOf(event.returnValues.storeName)
      newStoreNameArray.splice(indexStoreName, 1)
      this.setState({ storeIds: newStoreIdArray, storeNames: newStoreNameArray})
      }

    })
    .on('error', console.error);
  }

  listenItemAddedEvent=() => {

    this.state.storesInstance.events.ItemAdded({fromBlock: 0})
    .on('data', async (event) => {

      this.setState({ itemId: event.returnValues.sku, itemName: event.returnValues.itemName, itemPrice: event.returnValues.itemPrice, itemQuantity: event.returnValues.itemQuantity, itemAvailability: event.returnValues.itemAvailability})

    })
    .on('error', console.error);
  }



  handleAddAdmin = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.addAdmin(this.state.adminAddressToAdd).send({from: this.state.accounts});
    //const response = await this.state.storesInstance.methods.isAdmin(this.state.adminAddressToAdd).call();

    // Update state with the result.
    this.setLastTransactionDetails(result)
    }
  };

  handleRemoveAdmin = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.removeAdmin(this.state.adminAddressToRemove).send({from: this.state.accounts});

    // Update state with the result.
    this.setLastTransactionDetails(result)
    }
  };


  handleAddStoreOwner = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.addStoreOwner(this.state.ownerAddressToAdd).send({from: this.state.accounts});

    var newStoreOwnersArray = this.state.storeOwners.slice()
    newStoreOwnersArray.push(this.state.ownerAddressToAdd)
    this.setState({ storeOwners: newStoreOwnersArray })
    // Update state with the result.
    this.setLastTransactionDetails(result)
    }
  };

  handleRemoveStoreOwner = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.removeStoreOwner(this.state.ownerAddressToRemove).send({from: this.state.accounts});
    // Update state with the result.
    this.setLastTransactionDetails(result)
    }
  };

  handleOpenStore = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.openStore(this.state.storeName).send({from: this.state.accounts});
    // Update state with the result.
/*
    const response = await this.state.storesInstance.methods.getBalance().call();

    //const balance_eth = this.state.web3.fromWei(balance_wei, 'ether')
    // Update state with the result.
    this.setState({ storeBalance: response });
*/
    this.setLastTransactionDetails(result)
    }
  };

  handleCloseStore = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.closeStore(this.state.storeId).send({from: this.state.accounts});

    this.setLastTransactionDetails(result)
    }
  };


  handleWithdrawStoreBalance = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
      // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.withdrawStoreBalance(this.state.web3.utils.toWei(this.state.withdrawAmount, 'ether')).send({from: this.state.accounts});

    this.setLastTransactionDetails(result)
    }
  };

  handleAddItem = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
      // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.addItem(this.state.itemName, this.state.web3.utils.toWei(this.state.itemPrice, 'ether'), this.state.itemQuantity, this.state.itemStoreId).send({from: this.state.accounts});

    this.setLastTransactionDetails(result)
    }
  };

  handleRemoveItem = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.removeItem(this.state.itemStoreId, this.state.itemId).send({from: this.state.accounts});

    this.setLastTransactionDetails(result)
    }
  };
/*
  handleBuyItem = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
      // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.buyItem(this.state.itemStoreId, this.state.itemId, this.state.itemQuantity).send({from: this.state.accounts, value: this.state.web3.utils.toWei(this.state.itemPrice, 'ether')});

    this.setLastTransactionDetails(result)
    }
  };
*/
  handleChange(event)
  {
    switch(event.target.name) {
        case "addAdmin":
            this.setState({adminAddressToAdd: event.target.value})
            break;
        case "removeAdmin":
            this.setState({adminAddressToRemove: event.target.value})
            break;
        case "addStoreOwner":
            this.setState({ownerAddressToAdd: event.target.value})
            break;
        case "removeStoreOwner":
            this.setState({ownerAddressToRemove: event.target.value})
            break;
        case "openStore":
            this.setState({storeName: event.target.value})
            break;
        case "closeStore":
            this.setState({storeId: event.target.value})
            break;
        case "withdrawStoreBalance":
            this.setState({withdrawAmount: event.target.value})
            break;
        case "itemName":
            this.setState({itemName: event.target.value})
            break;
        case "itemPrice":
            this.setState({itemPrice: event.target.value})
            break;
        case "itemQuantity":
            this.setState({itemQuantity: event.target.value})
              break;
        case "itemStoreId":
            this.setState({itemStoreId: event.target.value})
              break;
        case "itemId":
            this.setState({itemId: event.target.value})
            break;
        case "itemAvailability":
            this.setState({itemAvailability: event.target.value})
            break;
        case "itemStoreId2remove":
            this.setState({itemStoreId: event.target.value})
            break;
        case "itemStoreId2Buy":
            this.setState({itemStoreId: event.target.value})
            break;
        case "itemId2Buy":
            this.setState({itemStoreId: event.target.value})
            break;
        case "itemQuantity2Buy":
            this.setState({itemStoreId: event.target.value})
            break;
        default:
            break;
      }
  }

  setLastTransactionDetails(result)
  {
    if(result.tx !== 'undefined')
    {
      this.setState({etherscanLink: etherscanBaseUrl+"/tx/"+result.tx})
    }
    else
    {
      this.setState({etherscanLink: etherscanBaseUrl})
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <a href={this.state.etherscanLink} target="_blank" rel="noopener noreferrer">Last Transaction Details</a>
      <Card maxWidth={'320px'} mx={'auto'} p={3} px={4}>
        <NetworkIndicator
          currentNetwork={this.state.networkId}
          requiredNetwork={4}
        />
      </Card>
      <Heading as={"h4"}> Current Ethereum Address: {this.state.accounts} </Heading>
      <Heading as={"h1"}> Online Marketplace </Heading>
      <Flex>
      <Box p={3} width={1 / 2}>
      <Heading> Manage Admins </Heading>
      <Form>
          <Input
          type="text"
          placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
          name="addAdmin"
          value={this.state.adminAddressToAd}
          onChange={this.handleChange} />
          <Button value="Submit" onClick={this.handleAddAdmin} >Add Admin </Button>
      </Form>
      <Form>
          <Input
          type="text"
          placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
          name="removeAdmin"
          value={this.state.adminAddressToRemove}
          onChange={this.handleChange} />
          <Button value="Submit" onClick={this.handleRemoveAdmin} >Remove Admin </Button>
      </Form>
      </Box>
      <Box p={3} width={1 / 2}>
      <Table>
      <thead>
      <tr>
        <th>Admins</th>
        </tr>
      </thead>
      <tbody>
      {this.state.admins.map(adminAddress => (
        <tr>
            <td><EthAddress address={adminAddress}/></td>
        </tr>
      ))}
      </tbody>
      </Table>
      </Box>
      </Flex>
      <Flex>
      <Box p={3} width={1 / 2}>
      <Heading> Manage Store Owners </Heading>
      <Form>
        <Input
        type="text"
        placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
        name="addStoreOwner"
        value={this.state.ownerAddressToAdd}
        onChange={this.handleChange} />
        <Button value="Submit" onClick={this.handleAddStoreOwner} >Add Store Owner </Button>
      </Form>
      <Form>
        <Input
        type="text"
        placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
        name="removeStoreOwner"
        value={this.state.ownerAddressToRemove}
        onChange={this.handleChange} />
        <Button value="Submit" onClick={this.handleRemoveStoreOwner} >Remove Store Owner </Button>
      </Form>
      </Box>
      <Box p={3} width={1 / 2}>
      <Table>
      <thead>
      <tr>
        <th>Store Owners</th>
        </tr>
      </thead>
      <tbody>
      {this.state.storeOwners.map(storeOwnerAddress => (
        <tr>
            <td><EthAddress address={storeOwnerAddress}/></td>
        </tr>
      ))}
      </tbody>
      </Table>
      </Box>
      </Flex>
      <Flex>
      <Box p={3} width={1 / 2}>
      <Heading> Manage a Store </Heading>
      <Form>
      <Box>
      <Field label="Store Name:">
        <Input
        type="text"
        placeholder="e.g. Coffeeshop"
        required="true"
        name="openStore"
        value={this.state.storeName}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Button value="Submit" onClick={this.handleOpenStore} >Open Store </Button>
      </Box>
      </Form>
      <Form>
      <Box>
      <Field label="Store Id:">
        <Input
        type="text"
        placeholder="e.g. 0"
        required="true"
        name="closeStore"
        value={this.state.storeId}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Button value="Submit" onClick={this.handleCloseStore} >Close Store </Button>
      </Box>
      </Form>
      <Form>
      <Box>
      <Field label="Amount to withdraw:">
        <Input
        type="text"
        placeholder="e.g. 3 eth"
        name="withdrawStoreBalance"
        value={this.state.withdrawAmount}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
        <Button value="Submit" onClick={this.handleWithdrawStoreBalance} >Withdraw Store Balance </Button>
      </Box>
      </Form>
      </Box>
      <Box p={3} width={1 / 2}>
      <Table>
      <thead>
      <tr>
        <th>Id</th>
        <th>Store Name</th>
        <th>Store Balance</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>
      {this.state.storeIds[0]}
      </td>
      <td>
      {this.state.storeNames[0]}
      </td>
      <td>
      {this.state.storeBalances[0]}
      </td>
      </tr>
      </tbody>
      </Table>
      </Box>
      <Flex>
      </Flex>
      <Box p={3} width={1 / 2}>
      <Heading> Store's Inventory </Heading>
      <Form>
      <Box>
      <Field label="Item Name">
        <Input
        type="text"
        placeholder="e.g. Coffee"
        required="true"
        name="itemName"
        value={this.state.itemName}
        onChange={this.handleChange} />
      </Field>
      <Field label="Item Price">
        <Input
        type="text"
        placeholder="e.g. 1 eth"
        required="true"
        name="itemPrice"
        value={this.state.itemPrice}
        onChange={this.handleChange} />
      </Field>
      <Field label="Item Quantity">
        <Input
        type="text"
        placeholder="e.g. 10"
        required="true"
        name="itemQuantity"
        value={this.state.itemQuantity}
        onChange={this.handleChange} />
      </Field>
      <Field label="Store Id">
        <Input
        type="text"
        placeholder="e.g. 0"
        required="true"
        name="itemStoreId"
        value={this.state.itemStoreId}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Button value="Submit" onClick={this.handleAddItem} >Add Item </Button>
      </Box>
      </Form>
      <Form>
      <Box>
      <Field label="Store Id:">
        <Input
        type="text"
        placeholder="e.g. 0"
        required="true"
        name="itemStoreId2remove"
        value={this.state.itemStoreId}
        onChange={this.handleChange} />
      </Field>
      <Field label="Item Id:">
        <Input
        type="text"
        placeholder="e.g. 0"
        required="true"
        name="itemId"
        value={this.state.itemId}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Button value="Submit" onClick={this.handleRemoveItem} >Remove Item</Button>
      </Box>
      </Form>
      </Box>
      <Box p={3} width={1 / 2}>
      <Table>
      <thead>
      <tr>
        <th>Item Id</th>
        <th>Item Name</th>
        <th>Item Price</th>
        <th>Item Quantity</th>
        <th>Store Id </th>
        <th>Available</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <th> {this.state.itemId}</th>
      <th> {this.state.itemName}</th>
      <th> {this.state.itemPrice}</th>
      <th> {this.state.itemQuantity}</th>
      <th> {this.state.itemStoreId}</th>
      <th> {this.state.itemAvailability}</th>
      </tr>
      </tbody>
      </Table>
      </Box>
      </Flex>
      <Flex>
      <Box p={3} width={1 / 2}>
      <Heading> Buy an Item </Heading>
      <Form>
      <Box>
      <Field label="Store Id:">
        <Input
        type="text"
        placeholder="e.g. 0"
        required="true"
        name="itemStoreId2Buy"
        value={this.state.itemStoreId2Buy}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Field label="Item Id:">
        <Input
        type="text"
        placeholder="e.g. 0"
        required="true"
        name="itemId2Buy"
        value={this.state.itemId2Buy}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Field label="Item Quantity:">
        <Input
        type="text"
        placeholder="e.g. 2"
        required="true"
        name="itemQuantity2Buy"
        value={this.state.itemQuantity2Buy}
        onChange={this.handleChange} />
      </Field>
      </Box>
      <Box>
      <Button value="Submit" onClick={this.handleBuyItem} >Buy </Button>
      </Box>
      </Form>
      </Box>
      </Flex>
      </div>
    );
  }
}
export default App;
