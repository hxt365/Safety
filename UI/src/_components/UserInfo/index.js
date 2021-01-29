import React, { useContext } from 'react';
import UserAvatar from '_components/share/UserAvatar';
import { userContext } from '_store';
import './UserInfo.scss';

export default function UserInfo() {
  const { curUser } = useContext(userContext);

  return (
    <div className="user-info">
      <UserAvatar src={curUser.properties.avatar} size={120} />
      <div className="user-info__description">
        <span className="user-info__fullname">{curUser.properties.fullname}</span>
        <br />
        <span>{`Credit: ${curUser.properties.credit_upvote}/${curUser.properties.credit_devote}`}</span>
        <br />
        {/* <span>{`${curUser.properties.num_followers} followers`}</span> */}
      </div>
    </div>
  );
}
