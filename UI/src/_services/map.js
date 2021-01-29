import mapboxgl from 'mapbox-gl';
import markerIcon from '_assets/svg/marker.png';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default class MapService {
  constructor(mapContainerRef, center) {
    this.map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/hxt365/ckif2udj80hfo19s67qo40lb4',
      zoom: 16,
      minZoom: 6,
      center,
    });
  }

  addControl() {
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  }

  renderUserLocation(userCoords) {
    this.map.on('load', () => {
      const el = document.createElement('div');
      el.className = 'user-marker';
      new mapboxgl.Marker(el).setLngLat(userCoords).addTo(this.map);
    });
  }

  renderWarnings(warningFeatures) {
    this.map.on('load', () => {
      this.map.loadImage(markerIcon, (err, img) => {
        if (err) return;
        this.map.addImage('marker-icon', img, { sdf: true });

        this.map.addSource('warnings', {
          type: 'geojson',
          data: warningFeatures,
        });

        this.map.addLayer({
          id: 'warnings-layer',
          source: 'warnings',
          type: 'symbol',
          layout: {
            'icon-image': 'marker-icon',
            'icon-padding': 2,
            'icon-allow-overlap': true,
            'icon-size': 0.3,
          },
          paint: {
            'icon-color': [
              'match',
              ['get', 'topic'],
              'AI',
              '#f5222d',
              'TBR',
              '#722ed1',
              'C',
              '#eb2f96',
              'D',
              '#2f54eb',
              'O',
              '#faad14',
              'black',
            ],
          },
        });

        let popup;

        this.map.on('mouseenter', 'warnings-layer', (e) => {
          this.map.getCanvas().style.cursor = 'pointer';
          const features = this.map.queryRenderedFeatures(e.point, {
            layers: ['warnings-layer'],
          });
          if (!features.length) return;
          const feature = features[0];
          popup = new mapboxgl.Popup({ offset: [0, -15], closeButton: false, closeOnClick: false })
            .setLngLat(feature.geometry.coordinates)
            .setText(feature.properties.short_description)
            .addTo(this.map);
        });

        this.map.on('mouseleave', 'warnings-layer', () => {
          popup.remove();
          this.map.getCanvas().style.cursor = '';
        });
      });
    });
  }

  refreshMap(newWarningFeatures) {
    this.map.getSource('warnings').setData(newWarningFeatures);
  }

  listen(eventType, layerID, callback) {
    this.map.on(eventType, layerID, (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['warnings-layer'],
      });
      if (!features.length) return;
      const feature = features[0];
      callback(feature.id);
    });
  }

  getCenter() {
    return this.map.getCenter();
  }

  renderCenterMarker() {
    this.centerMarker = new mapboxgl.Marker();
    this.centerMarker.setLngLat(this.getCenter()).addTo(this.map);
    const callback = this.updateCenterMarkerPosition.bind(this);
    this.map.on('move', callback);
  }

  updateCenterMarkerPosition() {
    this.centerMarker.setLngLat(this.getCenter());
  }

  removeCenterMarker() {
    this.map.off('move', this.updateCenterMarkerPosition);
    this.centerMarker.remove();
  }

  addTempMarker(coords) {
    this.removeTempMarker();
    this.map.flyTo({ center: coords, zoom: 18 });
    // this.tempMarker = new mapboxgl.Marker();
    // this.tempMarker.setLngLat(coords).addTo(this.map);
  }

  removeTempMarker() {
    // this.tempMarker?.remove();
    this.pass = 0;
  }
}

export const fakeMarker = (id, { lat, lng }) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    properties: {
      id: `fake-marker-${id}`,
    },
  };
};
