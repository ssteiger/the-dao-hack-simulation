import React from 'react';
import { ethers } from 'ethers';
import { useContractReader } from 'eth-hooks';
import { useEventListener } from 'eth-hooks/events/useEventListener';
import { Transactor } from '../../helpers';
import Address from '../../components/Address';
import Balance from '../../components/Balance';
import { DarkContainer, Button, Badge } from '../../components/tailwind';

export default function DarkDAOCard({
  localProvider,
  readContracts,
  writeContracts,
  address: localAddress,
  price,
  gasPrice,
}) {
  const tx = Transactor(localProvider);

  const reenterEvents = useEventListener(
    readContracts,
    'DarkDAO',
    'Reenter',
    localProvider,
    1, // start block
  );

  // invest into TheDAO and get some DAO tokens
  const investInTheDAO = async () => {
    if (localProvider && readContracts && writeContracts) {
      const value = ethers.utils.parseEther('2.0');
      console.log(`DarkDAO is investing ${ethers.utils.formatEther(value)} Ξ into TheDAO`);

      const to = readContracts.DarkDAO.address;
      const result = await tx(
        writeContracts.TheDAO.invest(to, {
          gasPrice,
          value,
        }),
      );
    }
  };

  /*
  const fundDarkDAO = async () => {
    if (localProvider && readContracts && writeContracts) {
      // fund DarkDAO with 1 eth
      const result = await tx({
        to: readContracts.DarkDAO.address,
        value: ethers.utils.parseEther('1.0'),
      });
    }
  };
  */

  const executeHack = async () => {
    if (localProvider && readContracts && writeContracts) {
      const value = ethers.utils.parseEther('1.0');
      console.log(`attacking TheDAO using ${ethers.utils.formatEther(value)} Ξ (4x)`);

      const to = readContracts.TheDAO.address;
      const result = tx(
        writeContracts.DarkDAO.attack(to, {
          gasPrice,
          value,
        }),
      );
    }
  };

  const darkDAOTokenBalance = useContractReader(readContracts, 'TheDAO', 'balanceOf', [
    readContracts?.DarkDAO?.address,
  ]);

  return (
    <div className="w-full text-black dark:text-white">
      <DarkContainer className="mb-2">
        <div className="flex justify-center text-lg text-red-400">Dark DAO</div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center">
          <Badge>ETH balance</Badge>
        </div>

        <div className="flex justify-center pt-4 font-bold">
          <Balance
            address={readContracts?.DarkDAO?.address}
            provider={localProvider}
            price={price}
            textSize="text-base"
          />
        </div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center">
          <Badge>balance [TheDAO Tokens]</Badge>
        </div>
        <div className="flex justify-center text-base pt-4 font-bold break-all">
          {darkDAOTokenBalance ? darkDAOTokenBalance.toString() : 0}
        </div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center">
          <Button color="blue" onClick={investInTheDAO}>
            1. Invest Ξ2 with TheDAO
          </Button>
        </div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center">
          <Button color="red" onClick={executeHack}>
            2. Execute Hack
          </Button>
        </div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center text-lg">Re-Entrancy Logs</div>
      </DarkContainer>

      {reenterEvents.map(event => {
        const { args } = event;
        const { _target, _balance } = args;

        return (
          <DarkContainer className="mb-2 flex justify-between">
            <div>
              <Address address={_target} size={'short'} />
            </div>

            <Badge color="green">
              <Balance balance={_balance} price={price} textSize="text-base" />
            </Badge>
          </DarkContainer>
        );
      })}
    </div>
  );
}
