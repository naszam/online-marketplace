pragma solidity 0.5.16;

/// @title Adminable, a contract to manage admins
/// @author Nazzareno Massari
/// @notice You can use this contract to manage admins access in an Online Markeplace
/// @dev The deploying address, owner, is assigned as admin
/// @dev Admins are responsible for assigning and removing admin accounts
/// @dev All function calls are currently implemented without side effecs through TDD approach
/// @dev OpenZeppelin library is used for secure contract development
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
  /// @dev Added so ether sent to this contract is reverted if contract fails
  function() external payable {
    revert();
  }

  /// Modifiers
  modifier onlyAdmin() {
    require(isAdmin(msg.sender), "Caller is not an Admin");
    _;
  }
  
  /// @notice check if the address is an Admin
  /// @param account address to check
  /// @dev used in onlyAdmin() modifier 
  function isAdmin(address account)
    public
    view
    returns (bool)
  {
    return admins[account];
  }

  /// @notice add a new Admin
  /// @param account address of the new Admin
  function addAdmin(address account)
    public
    whenNotPaused()
    onlyAdmin()
    returns (bool)
  {
    admins[account] = true;
    emit AdminAdded(account);
    return true;
  }

  /// @notice remove an Admin
  /// @param account admin address to remove 
  function removeAdmin(address account)
    public
    whenNotPaused()
    onlyAdmin()
    returns (bool)
  {
    admins[account] = false;
    emit AdminRemoved(account);
    return true;
  }
}
