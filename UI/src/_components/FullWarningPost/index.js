import {
  ArrowLeftOutlined,
  DislikeOutlined,
  DislikeTwoTone,
  LikeOutlined,
  LikeTwoTone,
} from '@ant-design/icons';
import { Button, Card, Divider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import ActionButton from '_components/ActionButton';
import CommentList from '_components/CommentList';
import WarningPost from '_components/share/WarningPost';
import { devoteWarning, getDetailWarning, upvoteWarning } from '_services/api';
import { warningContext, getWarningByID, mapContext } from '_store';
import './FullWarningPost.scss';
import * as _ from 'lodash';

export default function FullWarningPost() {
  const { warningState, warningDispatch } = useContext(warningContext);
  const { mapState } = useContext(mapContext);
  const [warning, setWarning] = useState(
    getWarningByID(warningState.results.features, warningState.curWarningID),
  );

  useEffect(async () => {
    const res = await getDetailWarning(warningState.curWarningID);
    if (!res.ok) return;

    const { warning: w } = res;
    mapState.map.addTempMarker(w.geometry.coordinates);
    if (_.isEqual(w, warning)) return;
    setWarning(w);
    warningDispatch({
      type: 'update',
      payload: w,
    });
  }, [warningState.curWarningID]);

  const backToFeeds = () => {
    mapState.map.removeTempMarker();
    warningDispatch({
      type: 'set_current_warning',
      payload: {
        curWarningID: null,
      },
    });
  };

  const onUpvote = async (wid) => {
    const res = await upvoteWarning(wid);
    if (!res.ok) return;
    const { warning: w } = res;
    warningDispatch({
      type: 'update',
      payload: w,
    });
    setWarning(w);
  };

  const onDevote = async (wid) => {
    const res = await devoteWarning(wid);
    if (!res.ok) return;
    const { warning: w } = res;
    warningDispatch({
      type: 'update',
      payload: w,
    });
    setWarning(w);
  };

  return (
    <div className="full-warning-post">
      <Button icon={<ArrowLeftOutlined />} onClick={backToFeeds}>
        Back
      </Button>
      <Divider />
      <Card
        bordered={false}
        actions={[
          <ActionButton
            icon={warning.properties.upvoted ? LikeTwoTone : LikeOutlined}
            text={warning.properties.upvote}
            key="list-vertical-like-o"
            onClick={() => onUpvote(warning.id)}
          />,
          <ActionButton
            icon={warning.properties.devoted ? DislikeTwoTone : DislikeOutlined}
            text={warning.properties.devote}
            key="list-vertical-dislike-o"
            onClick={() => onDevote(warning.id)}
          />,
        ]}
      >
        <WarningPost warning={warning.properties} />
      </Card>
      <Divider />
      <CommentList url={warning.properties.comments_url} wid={warning.id} />
    </div>
  );
}
