import React, { useContext, useEffect, useState } from 'react';
import UserPopup from '_components/UserPopup';
import Map from '_components/Map';
import './HomeView.scss';
import { Layout, Tabs } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import Greeter from '_components/Greeter';
import Feeds from '_components/Feeds';
import FullWarningPost from '_components/FullWarningPost';
import { mapContext, warningContext } from '_store';

const { TabPane } = Tabs;

export default function HomeView() {
  const [loading, setLoading] = useState(true);
  const { warningState, warningDispatch } = useContext(warningContext);
  const { mapState } = useContext(mapContext);
  const [activeTab, setActiveTab] = useState('feeds');

  useEffect(() => {
    mapState.map?.listen('click', 'warnings-layer', (wid) => {
      warningDispatch({
        type: 'set_current_warning',
        payload: {
          curWarningID: wid,
        },
      });
    });
  }, [mapState.map]);

  useEffect(() => {
    if (warningState.curWarningID !== null) setActiveTab('post');
    else setActiveTab('feeds');
  }, [warningState.curWarningID]);

  return loading ? (
    <Greeter toggleLoading={() => setLoading((l) => !l)} />
  ) : (
    <div className="home-view">
      <Layout style={{ height: '100%' }} hasSider>
        <Sider
          className="home-view__sider"
          width="40%"
          theme="light"
          style={{ paddingBottom: '2rem' }}
        >
          <Tabs animated activeKey={activeTab}>
            <TabPane tab="Feeds" key="feeds">
              <Feeds />
            </TabPane>
            <TabPane tab="Warning post" key="post">
              {warningState.curWarningID !== null && <FullWarningPost />}
            </TabPane>
          </Tabs>
        </Sider>
        <Content>
          <UserPopup />
          <Map />
        </Content>
      </Layout>
    </div>
  );
}
