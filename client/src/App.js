import React, { Component } from "react";
import Stores from "./contracts/Stores.json";
import getWeb3 from "./getWeb3";

import "./App.css";

import { Button, Box, Flex, Form, Input, Heading, Field, Table, EthAddress } from 'rimble-ui';

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
      storeName: undefined,
      admins:[],
      storeOwners:[]
    }

    this.handleAddAdmin = this.handleAddAdmin.bind(this)
    this.handleRemoveAdmin = this.handleRemoveAdmin.bind(this)
    this.handleAddStoreOwner = this.handleAddStoreOwner.bind(this)
    this.handleRemoveStoreOwner = this.handleRemoveStoreOwner.bind(this)
    this.handleOpenStore = this.handleOpenStore.bind(this)
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
/*
      instance.events.AdminAdded((error, event)=>{
        console.log(event)
      })

      instance.events.StoreOwnerAdded((error, event) =>{
        console.log(event)
      })
*/


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: web3, accounts: accounts[0], storesInstance: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleAddAdmin = async (event) => {
    if (typeof this.state.storesInstance !== 'undefined') {
      event.preventDefault()
    // Get the value from the contract to prove it worked.
    let result = await this.state.storesInstance.methods.addAdmin(this.state.adminAddressToAdd).send({from: this.state.accounts});
    //const response = await this.state.storesInstance.methods.isAdmin(this.state.adminAddressToAdd).call();

    var newAdminsArray = this.state.admins.slice()
    newAdminsArray.push(this.state.adminAddressToAdd)
    this.setState({ admins: newAdminsArray })
    //this.setState({admins: this.state.adminAddressToAdd});
    //this.setState({admin_success: response})
    //this.setState({admin_success: result});

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

    //const response = await this.state.storesInstance.methods.isStoreOpen(0).call();

    //const balance_eth = this.state.web3.fromWei(balance_wei, 'ether')
    // Update state with the result.
    //this.setState({ balance: response });

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
      <Heading as={"h4"}> Current Eth Address: {this.state.accounts} </Heading>
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
      <tr>
        <td><EthAddress address={this.state.admins[0]} /></td>
      </tr>
      <tr>
        <td><EthAddress address={this.state.admins[1]} /></td>
      </tr>
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
      <tr>
        <td><EthAddress address={this.state.storeOwners[0]} /></td>
      </tr>
      <tr>
        <td><EthAddress address={this.state.storeOwners[1]} /></td>
      </tr>
      </tbody>
      </Table>
      </Box>
      </Flex>
      <Flex>
      <Box>
      <Heading> Manage a Store </Heading>
      <Form>
      <Box>
      <Field label="Store Name:">
        <Input
        type="text"
        placeholder="e.g. PetShop"
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
      </Box>
      </Flex>
      </div>
    );
  }
}
export default App;
