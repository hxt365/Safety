import React from 'react';
import './MapMarker.scss';

export default function MapMarker({ id }) {
  return <div id={`marker-${id}`} className="marker" />;
}
