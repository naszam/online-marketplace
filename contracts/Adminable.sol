pragma solidity ^0.5.0;

/// @title Adminable
/// @author Nazzareno Massari
/// @notice Set out the Admins states and modifiers
/// @dev Admins are responsible for assigning and removing admin accounts;
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";

contract Adminable is Ownable, Pausable {

  mapping (address => bool) private admins;

  /// Events
  event AdminAdded(address indexed admin);
  event AdminRemoved(address indexed admin);

  constructor() public {
    admins[msg.sender] = true;
  }

  /// @notice Fallback function
  /// Added so ether sent to this contract is reverted if contract fails
  function() external payable {
    revert();
  }

  /// Modifiers
  modifier onlyAdmin() {
    require(isAdmin(msg.sender), "Caller is not an Admin");
    _;
  }

  function isAdmin(address account)
    public
    view
    returns (bool)
  {
    return admins[account];
  }

  function addAdmin(address account)
    public
    whenNotPaused()
    onlyAdmin()
  {
    admins[account] = true;
    emit AdminAdded(account);
  }

  function removeAdmin(address account)
    public
    whenNotPaused()
    onlyAdmin()
  {
    admins[account] = false;
    emit AdminRemoved(account);
  }
}
