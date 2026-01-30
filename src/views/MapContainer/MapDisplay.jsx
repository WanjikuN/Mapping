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
const ZoomToLayers = ({ geoLayers, activeLayers }) => {
  const map = useMap();

  React.useEffect(() => {
    const activeGeoJSON = geoLayers
      .filter((layer) => activeLayers[layer.id])
      .map((layer) => L.geoJSON(layer.data));

    if (activeGeoJSON.length === 0) return;

    const group = L.featureGroup(activeGeoJSON);
    map.fitBounds(group.getBounds(), {
      padding: [40, 40],
      animate: true,
    });
  }, [map, geoLayers, activeLayers]);

  return null;
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
const MapDisplay = ({ geoLayers, activeLayers }) => {
  return (
    <div className="h-full w-[70%] bg-white shadow-md rounded p-1">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoLayers.map(
          (layer) =>
            activeLayers[layer.id] && (
              <GeoJSON
                key={layer.id}
                data={layer.data}
                style={{
                  color: "#2563eb",
                  weight: 2,
                  fillColor: "#93c5fd",
                  fillOpacity: 0.5,
                }}
                onEachFeature={(feature, layerObj) => {
                  if (feature.properties?.name) {
                    layerObj.bindPopup(feature.properties.name);
                  }
                }}
              />
            )
        )}
        <ZoomToLayers geoLayers={geoLayers} activeLayers={activeLayers} />
        <CustomControls />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
