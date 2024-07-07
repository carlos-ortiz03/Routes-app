import React, { useEffect, useState } from "react";
import MapGL, {
  Marker,
  Source,
  Layer,
  ViewState,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY as string;
console.log("Mapbox Token:", MAPBOX_TOKEN); // Debugging line

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
  center: { lat: number; lng: number; zoom: number };
  originalLocation: { lat: number; lng: number };
  directions: FeatureCollection<Geometry, GeoJsonProperties> | null;
}> = ({ center, originalLocation, directions }) => {
  const [viewState, setViewState] = useState<ViewState>({
    ...initialViewState,
    longitude: center.lng,
    latitude: center.lat,
    zoom: center.zoom,
  });

  useEffect(() => {
    if (!isNaN(center.lng) && !isNaN(center.lat) && !isNaN(center.zoom)) {
      setViewState((prevState) => ({
        ...prevState,
        longitude: center.lng,
        latitude: center.lat,
        zoom: center.zoom,
      }));
    } else {
      console.error("Invalid center coordinates:", center);
    }
  }, [center]);

  return (
    <MapGL
      {...viewState}
      style={containerStyle}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewState(evt.viewState)}
    >
      {!isNaN(originalLocation.lat) && !isNaN(originalLocation.lng) && (
        <Marker
          latitude={originalLocation.lat}
          longitude={originalLocation.lng}
        />
      )}
      {directions && (
        <Source id="route" type="geojson" data={directions}>
          <Layer
            id="route"
            type="line"
            paint={{
              "line-color": "#298b45", // Set line color to #298b45
              "line-width": 8,
            }}
          />
        </Source>
      )}
      <NavigationControl position="top-left" />
    </MapGL>
  );
};

export default MapComponent;
