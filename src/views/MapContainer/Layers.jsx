import * as React from 'react';
import { BsLayersFill } from "react-icons/bs";

const BASE_MAPS = [
  { id: 'satellite', label: 'Satellite' },
  { id: 'streets', label: 'Streets' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

const Layers = React.memo(({ 
  geoLayers, 
  activeLayers, 
  toggleLayer, 
  selectedBaseMap, 
  onBaseMapChange 
}) => {
  return (
    <div 
      data-testid="layers-panel" 
      className="h-auto lg:h-full w-full lg:w-[30%] shadow-md bg-white rounded p-1"
    >    
      <div className="bg-[rgba(82,97,41,0.425)] w-full h-full p-4">
        <h3 className="font-semibold mb-4 uppercase border-b border-white/40 shadow-lg flex flex-row justify-start items-center gap-2 py-2 pl-1">
          <BsLayersFill size={20} className="text-[rgba(82,97,41,0.97)]" />
          <span>Map Controls</span>
        </h3>

        {/* Base Maps Section */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-md uppercase">Base Maps</h4>
          <div className="ml-6 space-y-2">
            {BASE_MAPS.map((baseMap) => (
              <div key={baseMap.id} className="flex items-center gap-2 accent-[#be9d67]">
                <input
                  type="radio"
                  id={baseMap.id}
                  name="baseMap"
                  checked={selectedBaseMap === baseMap.id}
                  onChange={() => onBaseMapChange(baseMap.id)}
                  className="scale-125 cursor-pointer"
                />
                <label htmlFor={baseMap.id} className="cursor-pointer text-md font-[lato]">
                  {baseMap.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay Layers Section */}
        <div>
          <h4 className="font-semibold mb-3 text-md uppercase">Overlay Layers</h4>
          <div className="ml-6 space-y-2">
            {geoLayers.map((layer) => (
              <div key={layer.id} className="flex items-center gap-2 accent-[#be9d67]">
                <input
                  type="checkbox"
                  id={layer.id}
                  checked={activeLayers[layer.id] || false}
                  onChange={() => toggleLayer(layer.id)}
                  className="scale-125 cursor-pointer"
                />
                <label htmlFor={layer.id} className="cursor-pointer text-md font-[lato]">
                  {layer.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

Layers.displayName = 'Layers';

export default Layers;