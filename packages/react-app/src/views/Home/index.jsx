import React from 'react';
import { Row, Col } from 'antd';
import { useEventListener } from 'eth-hooks/events/useEventListener';

import TheDAOCard from './TheDAO';
import DarkDAOCard from './DarkDAO';
import LocalSignerCard from './LocalSigner';

export default function Home({ localProvider, readContracts, writeContracts, address, price, gasPrice }) {
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
