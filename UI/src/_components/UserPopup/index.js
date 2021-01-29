import React, { useContext, useState } from 'react';
import EditUserModal from '_components/EditUserModal';
import UserPopover from '_components/UserPopover';
import { HOME_PAGE } from '_constants';
import { logout } from '_services/api';
import { clearCurrentUser, mapContext, userContext, warningContext } from '_store';
import './UserPopup.scss';

export default function UserPopup() {
  const { userDispatch } = useContext(userContext);
  const { warningDispatch } = useContext(warningContext);
  const { mapDispatch } = useContext(mapContext);
  const [visibleModal, setVisibleModal] = useState(false);

  const showEditModal = () => {
    setVisibleModal(true);
  };

  const closeEditModal = () => {
    setVisibleModal(false);
  };

  const handleLogout = async () => {
    logout();
    clearCurrentUser();
    userDispatch({
      type: 'logout',
    });
    warningDispatch({
      type: 'reset',
    });
    mapDispatch({
      type: 'reset',
    });

    window.location.replace(HOME_PAGE);
  };

  return (
    <div className="user-popup">
      <UserPopover handleLogout={handleLogout} showEditModal={showEditModal} />
      <EditUserModal visible={visibleModal} closeModal={closeEditModal} />
    </div>
  );
}
