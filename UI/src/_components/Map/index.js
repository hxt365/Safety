import React, { useContext, useEffect, useRef } from 'react';
import { mapContext, userContext, warningContext } from '_store';
import './Map.scss';
import MapService from '_services';

export default function Map() {
  const { curUser } = useContext(userContext);
  const { warningState } = useContext(warningContext);
  const { mapDispatch } = useContext(mapContext);
  const mapContainerRef = useRef(null);

  useEffect(async () => {
    const map = new MapService(mapContainerRef, curUser.geometry.coordinates);
    map.addControl();
    map.renderWarnings(warningState.results);
    map.renderUserLocation(curUser.geometry.coordinates);
    mapDispatch({
      type: 'set_map',
      payload: {
        map,
      },
    });
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
}
