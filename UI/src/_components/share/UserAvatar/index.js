import { Avatar, Image } from 'antd';
import React from 'react';
import './UserAvatar.scss';

export default function UserAvatar({ src, size = 12, handleOnClick = null }) {
  return (
    <div className="user-avatar">
      <Avatar src={<Image src={src} preview={false} onClick={handleOnClick} />} size={size} />
    </div>
  );
}
