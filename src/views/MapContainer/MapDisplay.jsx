import * as React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-minimap";
import "leaflet-minimap/dist/Control.MiniMap.min.css";
import "leaflet-mouse-position";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
// Geojson Data
const dataGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Town Center" },
      geometry: {
        type: "Point",
        coordinates: [36.8219, -1.2921],
      },
    },
    {
      type: "Feature",
      properties: { name: "Main Road" },
      geometry: {
        type: "LineString",
        coordinates: [
          [36.8, -1.3],
          [36.82, -1.29],
          [36.84, -1.28],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Residential Area" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [36.8, -1.3],
            [36.85, -1.3],
            [36.85, -1.25],
            [36.8, -1.25],
            [36.8, -1.3],
          ],
        ],
      },
    },
  ],
};
// Fit bounds
const FitBounds = ({ geojson }) => {
  const map = useMap();

  React.useEffect(() => {
    const layer = L.geoJSON(geojson);
    map.fitBounds(layer.getBounds(), { padding: [40, 40] });
  }, [map, geojson]);

  return null;
};
const CustomControls = () => {
  const map = useMap();

  React.useEffect(() => {
    const baseLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );

    const miniMap = new L.Control.MiniMap(baseLayer, {
      toggleDisplay: true,
      minimized: true,
      position: "bottomright",
      zoom: 24,
      width: "270",
    });
    miniMap.addTo(map);

    //Zoom control
    const zoomControl = L.control.zoom({ position: "topright" });
    zoomControl.addTo(map);

    //Mouse position control
    const mousePositionControl = L.control.mousePosition({
      position: "bottomleft",
      prefix: "Lat : Lng",
    });
    mousePositionControl.addTo(map);

    // Scale control
    const scaleControl = L.control.scale({ position: "bottomleft" });
    scaleControl.addTo(map);

    //Cleanup
    return () => {
      map.removeControl(zoomControl);
      map.removeControl(mousePositionControl);
      map.removeControl(scaleControl);
      map.removeControl(miniMap);
    };
  }, [map]);

  return null;
};
// Map Component
const MapDisplay = () => {
  return (
    <div className="h-full w-[70%] bg-white shadow-md rounded p-1">
      <MapContainer
        center={[0, 0]} // temporary, fitBounds will override
        zoom={2}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          data={dataGeoJSON}
          style={{
            color: "#2563eb",
            weight: 2,
            fillColor: "#93c5fd",
            fillOpacity: 0.5,
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties?.name) {
              layer.bindPopup(feature.properties.name);
            }
          }}
        />
        <CustomControls />
        <FitBounds geojson={dataGeoJSON} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
