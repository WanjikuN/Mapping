import * as React from 'react'
import MapDisplay from '../../views/MapContainer/MapDisplay'
import Layers from '../../views/MapContainer/Layers'

const Map = () => {
  return (
    <div className='flex flex-row h-screen justify-center items-center text-center w-screen p-10 shadow-xl gap-6'>
      <MapDisplay />
      <Layers />
    </div>
  )
}

export default Map