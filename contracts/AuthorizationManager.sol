// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuthorizationManager {
    address public signer;
    mapping(bytes32 => bool) public usedAuthorizations;

    event AuthorizationUsed(bytes32 authId);

    constructor(address _signer) {
        signer = _signer;
    }

    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        uint256 chainId,
        uint256 nonce,
        bytes calldata signature
    ) external returns (bool) {
        bytes32 authId = keccak256(
            abi.encode(vault, recipient, amount, chainId, nonce)
        );

        require(!usedAuthorizations[authId], "Authorization already used");

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                authId
            )
        );

        address recoveredSigner = recoverSigner(messageHash, signature);
        require(recoveredSigner == signer, "Invalid signature");

        usedAuthorizations[authId] = true;
        emit AuthorizationUsed(authId);

        return true;
    }

    function recoverSigner(bytes32 hash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = split(sig);
        return ecrecover(hash, v, r, s);
    }

    function split(bytes memory sig)
        internal
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
