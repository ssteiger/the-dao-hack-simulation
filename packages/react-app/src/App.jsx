import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from 'eth-hooks';
import { useEventListener } from 'eth-hooks/events/useEventListener';
import { useExchangeEthPrice } from 'eth-hooks/dapps/dex';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import 'antd/dist/antd.css';
import 'graphiql/graphiql.min.css';
import './App.css';
import { Contract, Faucet, GasGauge, Ramp, NetworkDisplay, FaucetHint } from './components';
import Layout from './Layout';
import { NETWORKS } from './constants';
import externalContracts from './contracts/external_contracts';
// contracts
import deployedContracts from './contracts/hardhat_contracts.json';
import { Transactor, Web3ModalSetup } from './helpers';
import { Home } from './views';
import { useStaticJsonRPC } from './hooks';

const { ethers } = require('ethers');

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = true;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  'https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406',
  //`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, 'mainnet', 'rinkeby'];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log('📡 Connecting to Mainnet Ethereum');

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == 'function') {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, 'fast');
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, 'DAI', 'balanceOf', [
    '0x34aA3F359A9D614239015126635CE7732c18fDF3',
  ]);

  // keep track of a variable from the contract in the local React state:
  //const purpose = useContractReader(readContracts, 'YourContract', 'purpose');

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on('accountsChanged', () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const walletIsConnected = injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf('local') !== -1;

  return (
    <>
      <Layout
        networkOptions={networkOptions}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        useBurner={USE_BURNER_WALLET}
        address={address}
        localProvider={localProvider}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        walletIsConnected={walletIsConnected}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
      >
        <Switch>
          <Route exact path="/">
            <Home
              localProvider={localProvider}
              readContracts={readContracts}
              writeContracts={writeContracts}
              address={address}
              price={price}
              gasPrice={gasPrice}
            />
          </Route>
          <Route exact path="/the-dao-contract">
            <div className="dark:bg-gray-800 p-4 my-4 rounded-lg">
              <Contract
                name="TheDAO"
                price={price}
                signer={userSigner}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
                contractConfig={contractConfig}
              />
            </div>
          </Route>
          <Route exact path="/dark-dao-contract">
            <div className="dark:bg-gray-800 p-4 my-4 rounded-lg">
              <Contract
                name="DarkDAO"
                price={price}
                signer={userSigner}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
                contractConfig={contractConfig}
              />
            </div>
          </Route>
        </Switch>
        {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
        {/*
         <div className="fixed bottom-6 right-6">
          <div className="mb-1 space-x-2">
            <Ramp price={price} address={address} networks={NETWORKS} />
            <GasGauge gasPrice={gasPrice} />
            <a
              href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA"
              className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
            >
              💬 Support
            </a>
          </div>
          {/* if the local provider has a signer, let's show the faucet:
          {faucetAvailable && <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />}
        </div>
        */}
      </Layout>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div aria-live="assertive" className="fixed inset-0 flex items-start px-4 pt-20 pb-6 pointer-events-none">
        <div className="w-full flex flex-col items-end space-y-4">
          {/* Alert if wrong network is selected */}
          <NetworkDisplay
            NETWORKCHECK={NETWORKCHECK}
            localChainId={localChainId}
            selectedChainId={selectedChainId}
            targetNetwork={targetNetwork}
          />

          {/*yourLocalBalance.lte(ethers.BigNumber.from('0')) && (
            <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
          )*/}
        </div>
      </div>
    </>
  );
}

export default App;
