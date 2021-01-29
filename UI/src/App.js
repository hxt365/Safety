import React, { useReducer } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';

import LoginView from '_views/LoginView';
import HomeView from '_views/HomeView';
import PrivateRoute from '_components/share/PrivateRoute';

import {
  userInitialState,
  userReducer,
  userContext,
  warningReducer,
  warningInitialState,
  warningContext,
  mapReducer,
  mapInitialState,
  mapContext,
} from '_store';
import { HOME_PAGE, LOGIN_PAGE } from './_constants';

const App = () => {
  const [curUser, userDispatch] = useReducer(userReducer, userInitialState);
  const [warningState, warningDispatch] = useReducer(warningReducer, warningInitialState);
  const [mapState, mapDispatch] = useReducer(mapReducer, mapInitialState);

  return (
    <div className="App">
      <userContext.Provider value={{ curUser, userDispatch }}>
        <warningContext.Provider value={{ warningState, warningDispatch }}>
          <mapContext.Provider value={{ mapState, mapDispatch }}>
            <Switch>
              <Route path={LOGIN_PAGE} exact component={LoginView} />
              <PrivateRoute path={HOME_PAGE} component={HomeView} />
              <Redirect to={HOME_PAGE} />
            </Switch>
          </mapContext.Provider>
        </warningContext.Provider>
      </userContext.Provider>
    </div>
  );
};

export default App;
