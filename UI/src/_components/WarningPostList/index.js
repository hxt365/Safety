import { Empty, List } from 'antd';
import React, { useContext } from 'react';
import WarningPost from '_components/share/WarningPost';
import {
  LikeOutlined,
  LikeTwoTone,
  DislikeOutlined,
  DislikeTwoTone,
  CommentOutlined,
} from '@ant-design/icons';
import ActionButton from '_components/ActionButton';
import { devoteWarning, upvoteWarning } from '_services/api';
import { warningContext } from '_store';

export default function WarningPostList() {
  const { warningState, warningDispatch } = useContext(warningContext);

  const warnings = warningState.results?.features;

  const onUpvote = async (wid) => {
    const res = await upvoteWarning(wid);
    if (!res.ok) return;
    const { warning } = res;
    warningDispatch({
      type: 'update',
      payload: warning,
    });
  };

  const onDevote = async (wid) => {
    const res = await devoteWarning(wid);
    if (!res.ok) return;
    const { warning } = res;
    warningDispatch({
      type: 'update',
      payload: warning,
    });
  };

  const onComment = (wid) => {
    warningDispatch({
      type: 'set_current_warning',
      payload: {
        curWarningID: wid,
      },
    });
  };

  const actionIcons = ({ properties: warning, id: wid }) => [
    <ActionButton
      icon={warning.upvoted ? LikeTwoTone : LikeOutlined}
      text={warning.upvote}
      key="list-vertical-like-o"
      onClick={() => onUpvote(wid)}
    />,
    <ActionButton
      icon={warning.devoted ? DislikeTwoTone : DislikeOutlined}
      text={warning.devote}
      key="list-vertical-dislike-o"
      onClick={() => onDevote(wid)}
    />,
    <ActionButton
      icon={CommentOutlined}
      text={warning.Comment}
      key="list-vertical-comment-o"
      onClick={() => onComment(wid)}
    />,
  ];

  return warnings.length ? (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => page,
        pageSize: 10,
      }}
      dataSource={warnings}
      renderItem={(warning, id) => (
        <List.Item key={warning.id} actions={actionIcons(warning, id)}>
          <WarningPost warning={warning.properties} />
        </List.Item>
      )}
    />
  ) : (
    <Empty />
  );
}
