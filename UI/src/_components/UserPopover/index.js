import { Button, Divider, Popover } from 'antd';
import React, { useContext, useState } from 'react';
import './UserPopover.scss';
import UserAvatar from '_components/share/UserAvatar';
import { userContext } from '_store';
import UserInfo from '_components/UserInfo';

export default function UserPopover({ handleLogout, showEditModal }) {
  const { curUser } = useContext(userContext);
  const [visible, setVisible] = useState(false);

  const handleOnClick = () => {
    setVisible((v) => !v);
  };

  const openEditModal = () => {
    handleOnClick();
    showEditModal();
  };

  const userPopover = (
    <div className="user-popover__content">
      <UserInfo />
      <Divider style={{ margin: 16 }} />
      <Button type="default" shape="round" size="large" onClick={openEditModal}>
        Edit your profile
      </Button>
      <Divider style={{ margin: 16 }} />
      <Button type="default" size="middle" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );

  return (
    <div className="user-popover">
      <Popover
        placement="bottomRight"
        visible={visible}
        onVisibleChange={handleOnClick}
        content={userPopover}
      >
        <UserAvatar src={curUser.properties.avatar} size={48} handleOnClick={handleOnClick} />
      </Popover>
    </div>
  );
}
