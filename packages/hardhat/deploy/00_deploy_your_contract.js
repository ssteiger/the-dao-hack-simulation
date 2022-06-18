// deploy/00_deploy_your_contract.js

const { ethers, waffle } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const [signer0, signer1, signer2, signer3] = await ethers.getSigners();
  const chainId = await getChainId();
  const { provider } = waffle;

  await deploy("TheDAO", {
    from: deployer,
    // args: [],
    log: true,
    waitConfirmations: 1,
  });

  const theDAO = await ethers.getContract("TheDAO", deployer);

  const value = ethers.utils.parseEther("2");

  /// //
  console.log(
    `${signer1.address} invests ${ethers.utils.formatEther(
      value
    )} Ξ into TheDAO`
  );
  await theDAO.invest(signer1.address, { value });
  console.log(
    `${signer2.address} invests ${ethers.utils.formatEther(
      value
    )} Ξ into TheDAO`
  );
  await theDAO.invest(signer2.address, { value });
  console.log(
    `${signer3.address} invests ${ethers.utils.formatEther(
      value
    )} Ξ into TheDAO`
  );
  await theDAO.invest(signer3.address, { value });
  /// //

  await deploy("DarkDAO", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  const darkDAO = await ethers.getContract("DarkDAO", deployer);

  // log contract balances
  let theDAOBalance = await provider.getBalance(theDAO.address);
  theDAOBalance = ethers.utils.formatEther(theDAOBalance);
  theDAOBalance = parseFloat(theDAOBalance).toFixed(2);
  console.log({ theDAOBalance: `${theDAOBalance.toString()} Ξ` });

  let darkDAOBalance = await provider.getBalance(darkDAO.address);
  darkDAOBalance = ethers.utils.formatEther(darkDAOBalance);
  darkDAOBalance = parseFloat(darkDAOBalance).toFixed(2);
  console.log({ darkDAOBalance: `${darkDAOBalance.toString()} Ξ` });

  console.log({ deployer });
  //
};

module.exports.tags = ["TheDAO", "DarkDAO"];
