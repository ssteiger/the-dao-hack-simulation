import React from 'react';
import { useEventListener } from 'eth-hooks/events/useEventListener';
import Balance from '../../components/Balance';
import Address from '../../components/Address';
import { DarkContainer, Badge } from '../../components/tailwind';

export default function TheDAOCard({
  localProvider,
  readContracts,
  writeContracts,
  address: localAddress,
  price,
  gasPrice,
}) {
  const investmentEvents = useEventListener(
    readContracts,
    'TheDAO',
    'Investment',
    localProvider,
    1, // start block
  );

  console.log({ investmentEvents });

  const withdrawalEvents = useEventListener(
    readContracts,
    'TheDAO',
    'Withdrawal',
    localProvider,
    1, // start block
  );

  console.log({ withdrawalEvents });

  return (
    <div className="w-full text-black dark:text-white">
      <DarkContainer className="mb-2">
        <div className="flex justify-center text-lg text-blue-400">The DAO</div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center">
          <Badge>ETH balance</Badge>
        </div>

        <div className="flex justify-center pt-4 font-bold text-xl">
          <Balance
            address={readContracts?.TheDAO?.address}
            provider={localProvider}
            price={price}
            textSize="text-base"
          />
        </div>
      </DarkContainer>

      <DarkContainer className="mb-2">
        <div className="flex justify-center text-lg">Investments</div>
      </DarkContainer>

      {investmentEvents.map(event => {
        const { args } = event;
        const { investor, amount } = args;

        return (
          <DarkContainer className="mb-2 flex justify-between">
            <div className="text-sm">
              <Address address={investor} size={'short'} />
            </div>

            <Badge color="green">
              <Balance balance={amount} price={price} textSize="text-base" />
            </Badge>
          </DarkContainer>
        );
      })}

      <DarkContainer className="mb-2">
        <div className="flex justify-center text-lg">Withdrawals</div>
      </DarkContainer>

      {withdrawalEvents.map(event => {
        const { args } = event;
        const { to, amount } = args;

        return (
          <DarkContainer className="mb-2 flex justify-between">
            <div>
              <Address address={to} size={'short'} />
            </div>

            <Badge color="green">
              <Balance balance={amount} price={price} textSize="text-base" />
            </Badge>
          </DarkContainer>
        );
      })}
    </div>
  );
}
