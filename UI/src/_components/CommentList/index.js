import React, { useEffect, useState } from 'react';
import { Button, Divider, List, Spin } from 'antd';
import './CommentList.scss';
import { commentWarning, getCommentsOfWarning } from '_services/api';
import Comment from '_components/Comment';
import CommentInput from '_components/CommentInput';

export default function CommentList({ url, wid }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(url);

  const getComments = async () => {
    setLoading(true);
    const res = await getCommentsOfWarning(next);
    setLoading(false);
    if (!res.ok) return [];

    const { comments: c } = res;
    setNext(c.next);
    return c.results;
  };

  useEffect(async () => {
    const c = await getComments();
    setComments(c);
  }, []);

  const onLoad = async () => {
    const newComments = await getComments();
    const newData = [...comments, ...newComments];
    setComments(newData);
  };

  const addComment = async (newComment) => {
    const res = await commentWarning(wid, newComment);
    if (!res.ok) return;
    const { comment } = res;
    const newComments = [comment, ...comments];
    setComments(newComments);
  };

  return (
    <div className="comment-list">
      <CommentInput addComment={addComment} />
      <Divider />
      <List
        dataSource={comments}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Comment comment={item} />
          </List.Item>
        )}
      >
        {loading && (
          <div className="comment-list__loading">
            <Spin />
          </div>
        )}
      </List>
      {next && (
        <Button onClick={onLoad} type="link">
          Load more comments...
        </Button>
      )}
    </div>
  );
}
