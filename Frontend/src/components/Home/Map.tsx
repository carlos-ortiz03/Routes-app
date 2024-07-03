import React, { useEffect, useState } from "react";
import MapGL, { Marker, Source, Layer, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "key here";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const initialViewState: ViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 10,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const MapComponent: React.FC<{
  center: { lat: number; lng: number };
  directions: any;
}> = ({ center, directions }) => {
  const [viewState, setViewState] = useState<ViewState>({
    ...initialViewState,
    longitude: center.lng,
    latitude: center.lat,
  });

  useEffect(() => {
    setViewState((prevState) => ({
      ...prevState,
      longitude: center.lng,
      latitude: center.lat,
    }));
  }, [center]);

  return (
    <MapGL
      {...viewState}
      style={containerStyle}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewState(evt.viewState)}
    >
      <Marker latitude={center.lat} longitude={center.lng} />
      {directions && (
        <Source id="route" type="geojson" data={directions}>
          <Layer
            id="route"
            type="line"
            paint={{
              "line-color": "#888",
              "line-width": 8,
            }}
          />
        </Source>
      )}
    </MapGL>
  );
};

export default MapComponent;
