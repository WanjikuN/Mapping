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

  const toggleLayer = (id) => {
    setActiveLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-row h-screen w-screen p-20 gap-6">
      <MapDisplay geoLayers={geoLayers} activeLayers={activeLayers} />
      <Layers
        geoLayers={geoLayers}
        activeLayers={activeLayers}
        toggleLayer={toggleLayer}
      />
    </div>
  );
};

export default Map;
