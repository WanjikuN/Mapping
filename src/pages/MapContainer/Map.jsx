import * as React from "react";
import Layers from "../../views/MapContainer/Layers";
import MapDisplay from "../../views/MapContainer/MapDisplay";
import { geoLayers } from "./geoLayers";

const Map = () => {
  const [activeLayers, setActiveLayers] = React.useState({
    town_center: true,
    main_road: false,
    residential: false,
  });

  const [selectedBaseMap, setSelectedBaseMap] = React.useState('satellite');

  const toggleLayer = React.useCallback((id) => {
    setActiveLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleBaseMapChange = React.useCallback((baseMapId) => {
    setSelectedBaseMap(baseMapId);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen p-4 lg:p-20 gap-4 lg:gap-6">
      <MapDisplay
        geoLayers={geoLayers}
        activeLayers={activeLayers}
        selectedBaseMap={selectedBaseMap}
      />
      <Layers
        geoLayers={geoLayers}
        activeLayers={activeLayers}
        toggleLayer={toggleLayer}
        selectedBaseMap={selectedBaseMap}
        onBaseMapChange={handleBaseMapChange}
      />
    </div>
  );
};

export default Map;