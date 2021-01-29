import React, { useEffect } from 'react';
import './LoginView.scss';

import { ReactComponent as Alert } from '_assets/svg/alert.svg';
import { isAuthenticated } from '_store';
import { HOME_PAGE, LOGIN_PAGE } from '_constants';

import LoginButton from '_components/LoginButton';

export default function Greeter() {
  useEffect(() => {
    if (isAuthenticated() && window.location.pathname === LOGIN_PAGE)
      window.location.replace(HOME_PAGE);
  }, []);

  return (
    <div className="login-view">
      <div className="login-view__container">
        <Alert className="login-view__logo" />
        <LoginButton />
      </div>
    </div>
  );
}
