[![#built_with_Truffle](https://img.shields.io/badge/built%20with-Truffle-blueviolet?style=plastic&logo=Ethereum)](https://www.trufflesuite.com/)

# Online Marketplace

> Consensys Academy's 2019 Developer Bootcamp Final Project.  
> The Project implement an Online Marketplace DApp.

The deployed smart contract allow the owner, set as admin, to manage the admins of the marketplace (add/remove) and to manage store owners (add/remove).  
Then a store owner can manage the store's inventory and funds.  
Finally, the buyer can buy a specific item from the selected store.  

This project was chosen as template for developing a Data Marketplace, extending his functionality to allow renting a data set for a specific application, for a limited amount of time, with extra features like storing on IPFS, multi-sig access management, upgradability, ...

Built in ~3 weeks.

[Demo](https://youtu.be/shsTfzgBVUo	)


Project Setup
============

Clone this GitHub repository.

# Steps to compile and deploy

  - Global dependencies
    - Truffle & Ganache:
    ```sh
    $ npm install -g truffle ganache-cli
    ```
    - OpenZeppelin Contracts:
    ```sh
    $ npm install -g @openzeppelin/contracts
    ```
    - MythX for Truffle (optional):
    ```sh
    $ npm install -g truffle-security
    ```
## Running the project with local test network (ganache-cli)

   - Start ganache-cli with the following command:
     ```sh
     $ ganache-cli
     ```
   - Compile the smart contract using Truffle with the following command:
     ```sh
     $ truffle compile
     ```
   - Deploy the smart contracts using Truffle & Ganache with the following command:
     ```sh
     $ truffle migrate
     ```
   - Test the smart contracts using Truffle & Ganache with the following command:
     ```sh
     $ truffle test
     ```
   - Analyze the smart contracts using MythX for Truffle with the following command (optional):
     ```sh
     $ truffle run verify
     ```
## Deploying on Rinkeby's Testnet
  - Get an Ethereum Account on Metamask.
  - On the landing page, click “Get Chrome Extension.”
  - Create a .secret file cointaining the menomic.
  - Get some test ether from a [Rinkeby's faucet](https://faucet.rinkeby.io/).
  - Signup [Infura](https://infura.io/).
  - Create new project.
  - Copy the rinkeby URL into truffle-config.js.
  - Uncomment the following lines in truffle-config.js:
    ```
    // const HDWalletProvider = require("@truffle/hdwallet-provider");
    // const infuraKey = '...';
    // const infuraURL = 'https://rinkeby.infura.io/...';

    // const fs = require('fs');
    // const mnemonic = fs.readFileSync(".secret").toString().trim();
    ```
  - Install Truffle HD Wallet Provider:
    ```sh
    $ npm install @truffle/hdwallet-provider
    ```
  - Deploy the smart contract using Truffle & Infura with the following command:
    ```sh
    $ truffle migrate --network rinkeby
    ```

   The Project's smart contracts have been deployed on [Rinkeby](https://rinkeby.etherscan.io/address/0x527903D7938Fba0b2A88b55244b0eafb28047ff6).  
   The ABIs are available to test the project on Rinkeby's Network.  
## Using the DApp
  - Install [Ganache GUI](https://www.trufflesuite.com/ganache).
  - Change Ganache GUI port to 8545.
  - Import Ganache GUI mnemonic into MetaMask.
  - Connect MetaMask to Ganache GUI, adding a custom RPC specifing the Ganache GUI's RPC server URL.
  - Deploy the smart contracts to Ganache GUI:
    ```
    $ truffle migrate
    ```
  - Move to client directory on the project:
    ```
    $ cd client
    ```
  - Install dependencies:
    ```
    $ npm install
    ```
  - Start the Local Web Server:
    ```sh
    $ npm run start
    ```
  - Interacting with the User Interface (Proof of Concept):
    - The User (Admin) can add a new Admin;
    - Switch Account on MetaMask to the new Admin;
    - Add a Store Owner;
    - Switch Account on MetaMask to the Store Owner;
    - Open a Store;
    - Add a new Item;
    - Remove Item;
    - Try to withdraw the store balance (0), eg. 1 eth and getting an exception from MetaMask
    - Close Store;
    - Remove Store Owner;
    - Switch Account to the Owner (Admin);
    - Remove the Admin;
    - Done.  
    
   *the Buy function is commented in App.js because is still in development.*
