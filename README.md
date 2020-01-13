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
    - Truffle HD Wallet Provider:
    ```sh
    $ npm install -g @truffle/hdwallet-provider
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

## Deploying on Rinkeby's Testnet
  - Get an Ethereum Account on Metamask.
  - On the landing page, click “Get Chrome Extension.”
  - Create a .secret file cointaining the menomic.
  - Deploy the smart contract using Truffle & Infura with the following command:
    ```sh
    $ truffle migrate --network rinkeby
    ```

## Using the DApp

  - Start the Local Web Server:
    ```sh
    $ npm run start
    ```
