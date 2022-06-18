import React, { useRef, useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { notification } from 'antd';
import Address from './Address';
import Balance from './Balance';
import WalletModal from './WalletModal';
import { ellipsizedAddress } from '../helpers/ellipsizedAddress';
import { classNames, blockExplorerLink } from '../helpers';

export default function Account({
  address,
  connectText,
  ensProvider,
  walletIsConnected,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setUserRole,
  userProvider,
  userRole,

  userSigner,
  localProvider,
  mainnetProvider,
  price,
  web3Modal,
  blockExplorer,
}) {
  const ens = ''; //useDisplayAddress(ensProvider, address)
  const shortAddress = ellipsizedAddress(address);
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const registerButtonRef = useRef();
  const openPopover = () => setIsPopoverOpen(true);
  const closePopover = () => setIsPopoverOpen(false);
  const [walletOpen, setWalletOpen] = useState();
  const etherscanLink = blockExplorerLink(address, blockExplorer);

  const hasEns = ens !== shortAddress;

  const connectWallet = (
    <div className="flex items-center">
      <Menu as="div" className="ml-3 relative">
        <button
          key="loginbutton"
          onClick={() => loadWeb3Modal()}
          className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-blue-100 hover:bg-blue-200 text-gray-800 dark:bg-gray-900 dark:text-white"
        >
          connect
        </button>
      </Menu>
    </div>
  );

  const accountNavigation = [
    { name: 'Wallet', action: () => setWalletOpen(true) },
    { name: 'View in Explorer', action: () => window.open(etherscanLink, '_blank').focus() },
  ];

  accountNavigation.push({ name: 'Logout', action: logoutOfWeb3Modal });

  const UserDisplayName = ({ mb, textAlign }) =>
    hasEns ? (
      <>
        <p>{ens}</p>
        <p>{shortAddress}</p>
      </>
    ) : (
      <p>{shortAddress}</p>
    );

  const accountMenu = (
    <div className="flex items-center">
      <Menu as="div" className="ml-3 relative">
        <div className="flex items-center inline-flex items-center pl-0.5 border border-transparent select-none text-base text-gray-900 leading-4 font-normal rounded-full shadow-sm bg-slate-200 dark:bg-neutral-900 dark:text-white">
          <Balance address={address} provider={localProvider} price={price} textSize="text-base" />
          <Menu.Button className="inline-flex items-center px-3 py-0.5 border border-transparent text-base leading-4 font-normal rounded-full shadow-sm bg-slate-100 hover:border-slate-400 focus:outline-none focus:border-slate-400 dark:bg-neutral-800 dark:hover:border-gray-700 dark:focus:border-gray-700">
            <span className="sr-only">Open user menu</span>
            <Address
              address={address}
              disableAddressLink={true}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {accountNavigation.map(item => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <span
                    onClick={item.action}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-800',
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
      <WalletModal
        address={address}
        provider={localProvider}
        signer={userSigner}
        ensProvider={mainnetProvider}
        price={price}
        open={walletOpen}
        setOpen={setWalletOpen}
      />
    </div>
  );

  return <>{walletIsConnected ? accountMenu : connectWallet}</>;
}
