// geoLayers.js
export const geoLayers = [
  {
    id: "town_center",
    label: "Town Center",
    data: {
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
      ],
    },
  },
  {
    id: "main_road",
    label: "Main Road",
    data: {
      type: "FeatureCollection",
      features: [
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
      ],
    },
  },
  {
    id: "residential",
    label: "Residential Area",
    data: {
      type: "FeatureCollection",
      features: [
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
    },
  },
];
