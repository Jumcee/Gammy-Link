// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract gammy {
    struct user {
        bytes32 username;
        bytes32 password;
        uint256 balance;
        bool isActive; // To track active/inactive users
    }

    mapping(address => user) public user;
    mapping(bytes32 => address) public didToAddress;
    mapping(bytes32 => bool) public usedDIDs;

    event signUp(address indexed userAddress, bytes32 username, bytes32 did);
    event Login(address indexed userAddress);
    event Payment(address indexed from, address indexed to, uint256 amount);

    function signUp(
        bytes32 _username,
        bytes32 _password,
        bytes32 _did
    ) external {
        //check if user aleady exist
        require(
            users[msg.sender].username == bytes32(0),
            "User already exists"
        );

        //create a new user
        users[msg.sender] = User(_username, _password, msg.sender, _did);
        emit UserSignedUp(msg.sender, _username, _did);
    }

    function Login(bytes32 _username, bytes32 _password) public {
        require(
            users[msg.sender].username == _username &&
                users[msg.sender].password == _password,
            "Invalid credentials"
        );
        emit userLoggedIn(msg.sender, _username);
    }

    function isDidTaken(bytes32 _did) public view returns (bool) {
        return usedDIDs[_did];
    }
}
