import React from 'react';
import { Row, Col } from 'antd';
import { ethers } from 'ethers';
import { useContractReader } from 'eth-hooks';
import { useEventListener } from 'eth-hooks/events/useEventListener';
import { Transactor } from '../../helpers';

import TheDAOCard from './TheDAO';
import DarkDAOCard from './DarkDAO';
import LocalSignerCard from './LocalSigner';

export default function Home({ localProvider, readContracts, writeContracts, address, price, gasPrice }) {
  const tx = Transactor(localProvider);

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

  const randomInvestorInvestInTheDAO = async () => {
    if (localProvider && readContracts && writeContracts) {
      // 1. invest into TheDAO and get some DAO tokens
      const value = ethers.utils.parseEther('2.0');
      console.log(`DarkDAO is investing ${ethers.utils.formatEther(value)} Ξ into TheDAO`);

      console.log({ writeContracts });
      const to = readContracts.DarkDAO.address;
      const result = await tx(
        writeContracts.TheDAO.invest(to, {
          gasPrice,
          value,
        }),
      );
    }
  };

  const investInTheDAO = async () => {
    if (localProvider && readContracts && writeContracts) {
      // 1. invest into TheDAO and get some DAO tokens
      const value = ethers.utils.parseEther('2.0');
      console.log(`DarkDAO is investing ${ethers.utils.formatEther(value)} Ξ into TheDAO`);

      console.log({ writeContracts });
      const to = readContracts.DarkDAO.address;
      const result = await tx(
        writeContracts.TheDAO.invest(to, {
          gasPrice,
          value,
        }),
      );
    }
  };

  const fundDarkDAO = async () => {
    if (localProvider && readContracts && writeContracts) {
      // 1. fund DarkDAO with 1 eth
      const result = await tx({
        to: readContracts.DarkDAO.address,
        value: ethers.utils.parseEther('1.0'),
      });
    }
  };

  const executeHack = async () => {
    if (localProvider && readContracts && writeContracts) {
      // 1. invest into TheDAO and get some DAO tokens
      const value = ethers.utils.parseEther('1.0');
      console.log(`attacking TheDAO using ${ethers.utils.formatEther(value)} Ξ (4x)`);

      console.log({ writeContracts });
      const to = readContracts.TheDAO.address;
      const result = tx(
        writeContracts.DarkDAO.attack(to, {
          gasPrice,
          value,
        }),
      );

      // 1. invest into TheDAO and get some DAO tokens
    }
  };

  const darkDAOTokenBalance = useContractReader(readContracts, 'TheDAO', 'balanceOf', [
    readContracts?.DarkDAO?.address,
  ]);

  return (
    <Row gutter={[16, 24]} className="py-4">
      <Col className="gutter-row" md={8} xs={24}>
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
          <TheDAOCard
            localProvider={localProvider}
            readContracts={readContracts}
            writeContracts={writeContracts}
            address={address}
            price={price}
            gasPrice={gasPrice}
          />
        </div>
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
          <DarkDAOCard
            localProvider={localProvider}
            readContracts={readContracts}
            writeContracts={writeContracts}
            address={address}
            price={price}
            gasPrice={gasPrice}
          />
        </div>
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
          <LocalSignerCard
            localProvider={localProvider}
            readContracts={readContracts}
            writeContracts={writeContracts}
            address={address}
            price={price}
            gasPrice={gasPrice}
          />
        </div>
      </Col>
    </Row>
  );
}
