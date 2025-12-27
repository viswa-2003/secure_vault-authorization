const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVault System", function () {
  let authManager, vault;
  let owner, user, recipient;

  beforeEach(async function () {
    [owner, user, recipient] = await ethers.getSigners();

    const Auth = await ethers.getContractFactory("AuthorizationManager");
    authManager = await Auth.deploy(owner.address);
    await authManager.waitForDeployment();

    const Vault = await ethers.getContractFactory("SecureVault");
    vault = await Vault.deploy(await authManager.getAddress());
    await vault.waitForDeployment();
  });

  it("allows deposits", async function () {
    await user.sendTransaction({
      to: await vault.getAddress(),
      value: ethers.parseEther("2"),
    });

    const balance = await ethers.provider.getBalance(
      await vault.getAddress()
    );

    expect(balance).to.equal(ethers.parseEther("2"));
  });

  it("allows valid withdrawal", async function () {
    await user.sendTransaction({
      to: await vault.getAddress(),
      value: ethers.parseEther("2"),
    });

    const amount = ethers.parseEther("1");
    const nonce = 1;
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const authId = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256", "uint256", "uint256"],
        [
          await vault.getAddress(),
          recipient.address,
          amount,
          chainId,
          nonce,
        ]
      )
    );

    const signature = await owner.signMessage(
      ethers.getBytes(authId)
    );

    await expect(
      vault.withdraw(recipient.address, amount, nonce, signature)
    ).to.changeEtherBalances(
      [vault, recipient],
      [-amount, amount]
    );
  });

  it("prevents replay attack", async function () {
    await user.sendTransaction({
      to: await vault.getAddress(),
      value: ethers.parseEther("2"),
    });

    const amount = ethers.parseEther("1");
    const nonce = 42;
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const authId = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256", "uint256", "uint256"],
        [
          await vault.getAddress(),
          recipient.address,
          amount,
          chainId,
          nonce,
        ]
      )
    );

    const signature = await owner.signMessage(
      ethers.getBytes(authId)
    );

    await vault.withdraw(recipient.address, amount, nonce, signature);

    await expect(
      vault.withdraw(recipient.address, amount, nonce, signature)
    ).to.be.revertedWith("Authorization already used");
  });

  it("fails when amount is tampered", async function () {
    await user.sendTransaction({
      to: await vault.getAddress(),
      value: ethers.parseEther("3"),
    });

    const signedAmount = ethers.parseEther("1");
    const withdrawAmount = ethers.parseEther("2");
    const nonce = 99;
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const authId = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256", "uint256", "uint256"],
        [
          await vault.getAddress(),
          recipient.address,
          signedAmount,
          chainId,
          nonce,
        ]
      )
    );

    const signature = await owner.signMessage(
      ethers.getBytes(authId)
    );

    await expect(
      vault.withdraw(recipient.address, withdrawAmount, nonce, signature)
    ).to.be.reverted;
  });
});
