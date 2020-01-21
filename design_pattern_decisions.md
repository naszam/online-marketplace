# Design Pattern Deicisions

The following Design Pattern have been implemented into the project.

## Fail early and fail loud

Implemented using **require()** to check for conditions required for execution at the beginning of the function body to throw an exeption if the condition is not met.  

This allow to reduce unnecessary code execution in the event that an exception would be thown.

Also used inside modifiers and opted for multiple requires instead of a single one with boolean logic (&&) to improve readibility.

## Restricting Access

State variables are set using the keyword **private** to restrict access to other contracts and prevent them to access and modify the information.

Also used the modifiers **onlyAdmin()** and **onlyStoreOwner()** to restrict function access only to Admins or Store Owners.  

Admins can add/remove other admins and add/remove Store Owners.  

Store Owners can open/close a store, add/remove an item and withdraw an amount from the store balance.

## Mortal

## Pull over Push Payments (also known as the Withdrawal Pattern)

## Checks-Effects-Interactions 

## Circuit Breaker


