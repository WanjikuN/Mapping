import  * as React from 'react'
import { BsLayersFill } from "react-icons/bs";
const Layers = ({ geoLayers, activeLayers, toggleLayer }) => {
  return (
    <div className="h-full w-[30%] shadow-md bg-white rounded p-1">
      <div className=" bg-[rgba(82,97,41,0.425)] w-full h-full  p-4">
        <h3 className="font-semibold mb-4 uppercase border-b border-white/40 shadow-lg flex flex-row justify-start items-center gap-2 py-2 pl-1">
          <BsLayersFill size={20} className="text-[rgba(82,97,41,0.97)] " />{" "}
          <span>Layers</span>
        </h3>

        {geoLayers.map((layer) => (
          <label
            key={layer.id}
            className="accent-blue-300/40  flex items-center gap-4 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={activeLayers[layer.id]}
              onChange={() => toggleLayer(layer.id)}
              className="scale-150 cursor-pointer"
            />
            <span>{layer.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Layers;
