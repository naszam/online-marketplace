# Online Marketplace

Consensys Academy's 2019 Developer Bootcamp Final Project

Project Setup
============

Clone this GitHub repository. 

# Steps to compile and deploy Online Marketplace

  - Global dependencies
    - Truffle & Ganache:
    ```sh
    $ npm install -g truffle ganache-cli
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
     
## Deploying on Rinkeby's Testnet
  - Get an Ethereum Account on Metamask. 
  - On the landing page, click “Get Chrome Extension.”
  - Create a .secret file cointaining the menomic.
    
  - Install the Truffle HD wallet provider with the following command:
    ```sh
    $ npm install @truffle/hdwallet-provider
    ```
  - Deploy the smart contract using Truffle & Infura with the following command:
    ```sh
    $ truffle migrate --network rinkeby
    ```

