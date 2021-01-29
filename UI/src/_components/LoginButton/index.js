import React from 'react';
import FacebookLogin from 'react-facebook-login';

import { login } from '_services/api';
import { setCurrentUserID } from '_store';
import { HOME_PAGE } from '_constants';
import { useHistory } from 'react-router-dom';

export default function LoginButton() {
  const history = useHistory();

  const facebookResponse = async (res) => {
    const { accessToken } = res;
    const response = await login(accessToken);
    if (!response.ok) return;

    const { uid } = response.res;
    setCurrentUserID(uid);
    history.push(HOME_PAGE);
  };

  return (
    <FacebookLogin
      appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
      // autoLoad
      scope="public_profile, email"
      fields="name,email,picture"
      callback={facebookResponse}
    />
  );
}
