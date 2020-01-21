# Design Pattern Deicisions

The following Design Pattern have been implemented into the project.

## Fail early and fail loud

Implemented using **require()** to check for conditions required for execution at the beginning of the function body to throw an exeption if the condition is not met.  

This allow to reduce unnecessary code execution in the event that an exception would be thown.

Also used inside modifiers and opted for multiple requires instead of a single one with boolean logic (&&) to improve readibility.

## Restricting Access

State variable visibility is set using the keyword **private** to restrict access to other contracts and prevent them to access and modify the information [[SWC-108](https://swcregistry.io/docs/SWC-108)]. 

Also used the modifiers **onlyAdmin()** and **onlyStoreOwner()** to restrict function access only to Admins or Store Owners.  
Admins can add/remove other admins and add/remove Store Owners.  

Store Owners can open/close a store, add/remove an item and withdraw an amount from the store balance.

## Mortal

Not implemented.  

Inlcuded to explain why I haven't used it.

First, is not available inside the OpenZeppelin library anymore.

After some research, like the [issue #25](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/issues/25) on OpenZeppelin GitHub and the considerations on [StackExchange](https://ethereum.stackexchange.com/questions/59780/is-selfdestruct-a-good-practice), I've decided not to implement the Mortal pattern into my project to avoid also potential attacks [[SWC-106](https://swcregistry.io/docs/SWC-106)] and I've used the Circuit Breaker pattern instead to disable the contract functions.

## Pull over Push Payments (also known as the Withdrawal Pattern)

Implemented to withdraw the store balance using the function **withdrawStoreBalance()**, allowing store owners to withdraw a specific amount from their store balance. 

Also used the Checks-Effects-Interactions pattern inside the function as suggested by the [ConsenSys Diligence](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/), to prevent Reentrancy Attack, making sure all the interactions (external calls) happens at the end of the function body.

Inside the function body and inside other functions have been used **.call.value()** instead of **transfer()**, with a Fail Early Fail Loud pattern to check for success, following the [[EPI-1884](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1884.md)] introduced with the recent Istanbul hard fork.

Also implemented to prevent Denial of Service Attacks (DOS).

## Checks-Effects-Interactions 

Implemented in the **withdrawStoreBalance()** and other functions, making sure all the interactions happens at the end of the function body, to prevent Reentrancy Attacks.

## Circuit Breaker

Implemented inheriting **Pausable.sol** included inside the OpenZeppelin Library.

The provided modifier, **whenNotPaused()** has been used in all the functions in order to disable all the functions by calling the **pause()** function when needed.
