import * as React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-minimap";
import "leaflet-minimap/dist/Control.MiniMap.min.css";
import "leaflet-mouse-position";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";


const BASE_MAP_CONFIG = {
  satellite: {
    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google",
  },
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c"],
    attribution: "&copy; OpenStreetMap",
  },
  terrain: {
    url: "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google",
  },
  hybrid: {
    url: "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    subdomains: ["a", "b", "c", "d"],
    attribution: "&copy; CartoDB",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    subdomains: ["a", "b", "c", "d"],
    attribution: "&copy; CartoDB",
  },
};

const GEOJSON_STYLE = {
  color: "#2563eb",
  weight: 2,
  fillColor: "#93c5fd",
  fillOpacity: 0.5,
};

const ZoomToLayers = React.memo(({ geoLayers, activeLayers }) => {
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
});

ZoomToLayers.displayName = "ZoomToLayers";

const CustomControls = React.memo(({ selectedBaseMap }) => {
  const map = useMap();

  React.useEffect(() => {
    const currentConfig =
      BASE_MAP_CONFIG[selectedBaseMap] || BASE_MAP_CONFIG.satellite;

    const miniMapLayer = L.tileLayer(currentConfig.url, {
      subdomains: currentConfig.subdomains,
    });

    const miniMap = new L.Control.MiniMap(miniMapLayer, {
      toggleDisplay: true,
      minimized: true,
      position: "bottomright",
      zoom: 24,
      width: "270",
    });

    const zoomControl = L.control.zoom({ position: "topright" });
    const mousePositionControl = L.control.mousePosition({
      position: "bottomleft",
      prefix: "Lat : Lng",
    });
    const scaleControl = L.control.scale({ position: "bottomleft" });

    miniMap.addTo(map);
    zoomControl.addTo(map);
    mousePositionControl.addTo(map);
    scaleControl.addTo(map);

    return () => {
      map.removeControl(zoomControl);
      map.removeControl(mousePositionControl);
      map.removeControl(scaleControl);
      map.removeControl(miniMap);
    };
  }, [map, selectedBaseMap]);

  return null;
});

CustomControls.displayName = "CustomControls";

const DynamicTileLayer = React.memo(({ selectedBaseMap }) => {
  const currentMap =
    BASE_MAP_CONFIG[selectedBaseMap] || BASE_MAP_CONFIG.satellite;

  return (
    <TileLayer
      key={selectedBaseMap}
      attribution={currentMap.attribution}
      url={currentMap.url}
      subdomains={currentMap.subdomains}
    />
  );
});

DynamicTileLayer.displayName = "DynamicTileLayer";

/*Search Control */
const SearchControl = () => {
  const map = useMap();

  React.useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const geoSearch = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: true,
      showPopup: false,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(geoSearch);

    // Toggle Button
    const toggle = L.control({ position: "topleft" });
    toggle.onAdd = () => {
      const btn = L.DomUtil.create("button", "search-toggle");
      btn.innerHTML = "🔍";
      btn.title = "Toggle Search";

      Object.assign(btn.style, {
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        zIndex: "9999",
      });

      btn.onmouseenter = () => (btn.style.backgroundColor = "#f5f5f5");
      btn.onmouseleave = () => (btn.style.backgroundColor = "#fff");

      let visible = true;
      btn.onclick = () => {
        if (visible) map.removeControl(geoSearch);
        else map.addControl(geoSearch);
        visible = !visible;
      };

      return btn;
    };

    toggle.addTo(map);

    return () => {
      map.removeControl(geoSearch);
      map.removeControl(toggle);
    };
  }, [map]);

  return null;
};
const MapDisplay = React.memo(
  ({ geoLayers, activeLayers, selectedBaseMap = "satellite" }) => {
    const onEachFeature = React.useCallback((feature, layerObj) => {
      if (feature.properties?.name) {
        layerObj.bindPopup(feature.properties.name);
      }
    }, []);

    return (
      <div
        data-testid="map-display"
        className="h-full w-full lg:w-[70%] bg-white shadow-md rounded p-1"
      >
        <MapContainer
          center={[0, 0]}
          zoom={2}
          scrollWheelZoom
          zoomControl={false}
          className="w-full h-full"
        >
          <DynamicTileLayer selectedBaseMap={selectedBaseMap} />

          {geoLayers.map(
            (layer) =>
              activeLayers[layer.id] && (
                <GeoJSON
                  key={layer.id}
                  data={layer.data}
                  style={GEOJSON_STYLE}
                  onEachFeature={onEachFeature}
                />
              )
          )}

          <ZoomToLayers geoLayers={geoLayers} activeLayers={activeLayers} />
          <CustomControls selectedBaseMap={selectedBaseMap} />
          <SearchControl />
        </MapContainer>
      </div>
    );
  }
);

MapDisplay.displayName = "MapDisplay";

export default MapDisplay;
