// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAuthorizationManager {
    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        uint256 chainId,
        uint256 nonce,
        bytes calldata signature
    ) external returns (bool);
}

contract SecureVault {
    IAuthorizationManager public authManager;

    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    constructor(address _authManager) {
        authManager = IAuthorizationManager(_authManager);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(
        address recipient,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(address(this).balance >= amount, "Insufficient balance");

        bool ok = authManager.verifyAuthorization(
            address(this),
            recipient,
            amount,
            block.chainid,
            nonce,
            signature
        );

        require(ok, "Authorization failed");

        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Transfer failed");

        emit Withdrawal(recipient, amount);
    }
}
