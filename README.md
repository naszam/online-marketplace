# Online Marketplace
## [Under Development]

Consensys Academy's 2019 Developer Bootcamp Final Project.  
The Project implement an Online Marketplace DApp.

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
    - Truffle HD Wallet Provider (optional):
    ```sh
    $ npm install -g @truffle/hdwallet-provider
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
   - Deploy the smart contract using Truffle & Ganache with the following command:
     ```sh
     $ truffle migrate
     ```
   - Test the smart contract using Truffle & Ganache with the following command:
     ```sh
     $ truffle test
     ```
   - Analyzing the smart contract using MythX for Truffle with the following command (optional):
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
  - install the optional global dependencie, Truffle HD Wallet Provider:
  ```sh
  $ npm install -g @truffle/hdwallet-provider
  ```
  - Deploy the smart contract using Truffle & Infura with the following command:
    ```sh
    $ truffle migrate --network rinkeby
    ```

## Using the DApp

  - Start the Local Web Server:
    ```sh
    $ npm run start
    ```
