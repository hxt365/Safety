import React, { useContext, useEffect, useState } from 'react';
import './Greeter.scss';

import { getWarnings, updateUserLocation } from '_services/api';
import timer from '_utils/async';
import { zip } from '_utils';
import { ReactComponent as Alert } from '_assets/svg/alert.svg';
import { userContext, warningContext } from '_store';

export default function Greeter({ toggleLoading }) {
  const { userDispatch } = useContext(userContext);
  const { warningState, warningDispatch } = useContext(warningContext);
  const [error, setError] = useState(false);

  useEffect(async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let hasError = false;
        const { longitude, latitude } = position.coords;
        // Wait for all async requests
        Promise.all([
          updateUserLocation(longitude, latitude),
          getWarnings(warningState.filter),
          timer(1000),
        ]).then((result) => {
          zip(
            result.slice(0, 2),
            [userDispatch, warningDispatch],
            ['set_user', 'set_warnings'],
            ['user', 'warnings'],
          ).forEach((element) => {
            const [res, dispatch, actionType, field] = element;
            if (!res.ok) {
              hasError = true;
              setError(true);
              return;
            }
            dispatch({
              type: actionType,
              payload: res[field],
            });
          });
          // Show home view
          if (!hasError) toggleLoading();
        });
      },
      () => setError(true),
      { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true },
    );
  }, []);

  return (
    <div className="greeter">
      <div className="greeter__logo">
        <Alert className="animate_zoom" />
        {error && (
          <span className="greeter__error-msg">
            Something has gone wrong
            <br />
            Please restart the application!
          </span>
        )}
      </div>
    </div>
  );
}
