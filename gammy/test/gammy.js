const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Gammy', function () {
  let Gammy;
  let gammy;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    Gammy = await ethers.getContractFactory('Gammy');
    gammy = await Gammy.deploy();
    await gammy.waitForDeployment();
  });

  it('should sign up a new user', async function () {
    const username = ethers.utils.formatBytes32String('Alice');
    const password = ethers.utils.formatBytes32String('password');
    const did = ethers.utils.formatBytes32String('did123');

    await expect(gammy.connect(user1).signUp(username, password, did))
      .to.emit(gammy, 'SignUp')
      .withArgs(user1.address, username, did);

    const user = await gammy.users(user1.address);
    expect(user.username).to.equal(username);
    expect(user.password).to.equal(password);
    expect(user.balance).to.equal(0); // Initial balance should be 0
  });

  it('should log in a user with valid credentials', async function () {
    const username = ethers.utils.formatBytes32String('Alice');
    const password = ethers.utils.formatBytes32String('password');
    const did = ethers.utils.formatBytes32String('did123');

    await gammy.connect(user1).signUp(username, password, did);

    await expect(gammy.connect(user1).login(username, password))
      .to.emit(gammy, 'Login')
      .withArgs(user1.address);
  });

  it('should add payment between users', async function () {
    const username1 = ethers.utils.formatBytes32String('Alice');
    const username2 = ethers.utils.formatBytes32String('Bob');
    const password = ethers.utils.formatBytes32String('password');
    const did1 = ethers.utils.formatBytes32String('did123');
    const did2 = ethers.utils.formatBytes32String('did456');

    await gammy.connect(user1).signUp(username1, password, did1);
    await gammy.connect(user2).signUp(username2, password, did2);

    const amount = 100;

    await expect(gammy.connect(user1).addPayment(user2.address, amount))
      .to.emit(gammy, 'Payment')
      .withArgs(user1.address, user2.address, amount);

    const user1Balance = await gammy.users(user1.address);
    const user2Balance = await gammy.users(user2.address);
    expect(user1Balance.balance).to.equal(0); // Assuming initial balance was 0
    expect(user2Balance.balance).to.equal(amount);
  });
});
