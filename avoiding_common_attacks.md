# Avoiding Common Attacks

The project has been checked using MythX for Truffle (partial verification).
```
$ truffle run verify
```

## Floating Pragma [[SWC-103](https://swcregistry.io/docs/SWC-103)]

Prevented specifing the solc version in my truffle project set to 0.5.16. 

Found using MythX.

## Integer Overflow and Underflow [[SWC-101](https://swcregistry.io/docs/SWC-101)]

Prevented inheriting SafeMath.sol from OpenZeppelin Library.

## Reentrancy Attack [[SWC-107](https://swcregistry.io/docs/SWC-107)]

Prevented implementing the Withdrawal and Checks-Effects-Interactions.

## Denial of Service Attacks (DOS) [[SWC-113](https://swcregistry.io/docs/SWC-113)][[SWC-128](https://swcregistry.io/docs/SWC-128)]

Prevented implementing the Withdrawal pattern.
