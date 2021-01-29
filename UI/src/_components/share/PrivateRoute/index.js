/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { isAuthenticated } from '_store';
import { LOGIN_PAGE } from '_constants';

export default function PrivateRoute({ component: Component, ...config }) {
  if (isAuthenticated()) return <Route {...config} render={(props) => <Component {...props} />} />;
  return <Redirect to={LOGIN_PAGE} />;
}
