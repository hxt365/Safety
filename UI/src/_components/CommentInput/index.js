import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import UserAvatar from '_components/share/UserAvatar';
import { userContext } from '_store';
import './CommentInput.scss';

export default function CommentInput({ addComment }) {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const { curUser } = useContext(userContext);

  const onSubmit = () => {
    if (text === '') return;
    const formData = new FormData();
    formData.append('content', text);
    if (files.length === 1) formData.append('photo', files[0]);
    addComment(formData);
    setText('');
    setFiles([]);
  };

  const beforeUpload = (f) => {
    setFiles([f]);
    return false;
  };

  return (
    <div className="comment-input__container">
      <UserAvatar src={curUser.properties.avatar} size={41} />
      <Input
        type="text"
        maxLength={500}
        onPressEnter={onSubmit}
        placeholder="Your comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Upload
        accept="image/*"
        listType="picture"
        beforeUpload={beforeUpload}
        fileList={files}
        showUploadList={false}
        disabled={files?.length === 1}
      >
        <Button icon={<UploadOutlined />} />
      </Upload>
    </div>
  );
}
