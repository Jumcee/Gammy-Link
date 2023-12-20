// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Gammy {
    struct User {
        bytes32 username;
        bytes32 password;
        uint256 balance;
    }

    mapping(address => User) public users;
    mapping(bytes32 => address) public didToAddress;

    event SignUp(address indexed userAddress, bytes32 username, bytes32 did);
    event Login(address indexed userAddress);
    event Payment(address indexed from, address indexed to, uint256 amount);

    function signUp(
        bytes32 _username,
        bytes32 _password,
        bytes32 _did
    ) external {
        // Check if user already exists
        require(
            users[msg.sender].username == bytes32(0),
            "User already exists"
        );

        // Create a new user
        users[msg.sender] = User(_username, _password, 0); // Assuming initial balance is 0
        didToAddress[_did] = msg.sender;
        emit SignUp(msg.sender, _username, _did);
    }

    function login(bytes32 _username, bytes32 _password) external {
        require(
            users[msg.sender].username == _username &&
                users[msg.sender].password == _password,
            "Invalid credentials"
        );
        emit Login(msg.sender);
    }

    function addPayment(address _to, uint256 _amount) external {
        require(users[msg.sender].balance >= _amount, "Insufficient funds");
        users[msg.sender].balance -= _amount;
        users[_to].balance += _amount;
        emit Payment(msg.sender, _to, _amount);
    }
}
