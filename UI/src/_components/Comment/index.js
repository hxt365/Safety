import React from 'react';
import WarningPost from '_components/share/WarningPost';
import './Comment.scss';

export default function Comment({ comment }) {
  const item = {
    ...comment,
    long_description: comment.content,
  };
  if (comment.photo) item.photos = [{ id: 1, src: comment.photo }];

  return (
    <div className="comment">
      <WarningPost warning={item} />
    </div>
  );
}
