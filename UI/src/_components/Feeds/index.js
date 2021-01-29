import React from 'react';

import { Collapse, Divider } from 'antd';
import WarningPostList from '_components/WarningPostList';
import WarningFilter from '_components/WarningFilter';
import CreateWarningForm from '_components/CreateWarningForm';

const { Panel } = Collapse;

export default function Feeds() {
  return (
    <div className="feeds">
      <Collapse ghost>
        <Panel header="Create a warning">
          <CreateWarningForm />
        </Panel>
        <Panel header="Filter">
          <WarningFilter />
        </Panel>
      </Collapse>
      <Divider />
      <WarningPostList />
      <span>&nbsp;</span>
    </div>
  );
}
