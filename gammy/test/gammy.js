const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gammy Contract", function () {
  let gammy;

  beforeEach(async () => {
    const Gammy = await ethers.getContractFactory("Gammy");
    gammy = await Gammy.deploy();
    await gammy.deployed();
  });

  it("Should sign up a new user", async function () {
    const [signer] = await ethers.getSigners();

    const username = ethers.utils.formatBytes32String("Alice");
    const password = ethers.utils.formatBytes32String("123456");
    const did = ethers.utils.formatBytes32String("someDID");

    await expect(gammy.signUp(username, password, did))
      .to.emit(gammy, "SignUp")
      .withArgs(signer.address, username, did);

    const user = await gammy.users(signer.address);
    expect(user.username).to.equal(username);
    expect(user.password).to.equal(password);

    const addressMappedToDID = await gammy.didToAddress(did);
    expect(addressMappedToDID).to.equal(signer.address);
  });

  it("Should allow a user to log in", async function () {
    const [signer] = await ethers.getSigners();

    const username = ethers.utils.formatBytes32String("Alice");
    const password = ethers.utils.formatBytes32String("123456");
    const did = ethers.utils.formatBytes32String("someDID");

    await gammy.signUp(username, password, did);

    await expect(gammy.login(username, password))
      .to.emit(gammy, "Login")
      .withArgs(signer.address);
  });

  it("Should allow a user to add payment", async function () {
    const [signer, receiver] = await ethers.getSigners();

    const amount = ethers.utils.parseEther("1");

    await gammy.signUp(
      ethers.utils.formatBytes32String("Alice"),
      ethers.utils.formatBytes32String("123456"),
      ethers.utils.formatBytes32String("someDID")
    );

    await gammy.addPayment(receiver.address, amount);
    const senderBalance = await gammy.users(signer.address);
    const receiverBalance = await gammy.users(receiver.address);

    expect(senderBalance.balance).to.equal(0);
    expect(receiverBalance.balance).to.equal(amount);
  });
});
