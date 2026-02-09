import { render } from '@testing-library/react';
import { vi } from 'vitest';
import MapDisplay from '../MapDisplay';

// filepath: src/views/MapContainer/MapDisplay.test.jsx

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }) => <div data-testid="map-container" {...props}>{children}</div>,
  TileLayer: (props) => <div data-testid="tile-layer" {...props} />,
  GeoJSON: (props) => <div data-testid="geojson" data-layer-id={props['data-layer-id']} {...props} />,
  useMap: vi.fn(() => ({
    fitBounds: vi.fn(),
    removeControl: vi.fn(),
  })),
}));

// Mock Leaflet
vi.mock('leaflet', () => ({
  default: {
    tileLayer: vi.fn(() => ({})),
    Control: {
      MiniMap: vi.fn(function() {
        this.addTo = vi.fn();
      }),
    },
    control: {
      zoom: vi.fn(() => ({ addTo: vi.fn(), removeControl: vi.fn() })),
      mousePosition: vi.fn(() => ({ addTo: vi.fn() })),
      scale: vi.fn(() => ({ addTo: vi.fn() })),
    },
    featureGroup: vi.fn((layers) => ({
      getBounds: vi.fn(() => [
        [0, 0],
        [1, 1],
      ]),
    })),
    geoJSON: vi.fn((data) => ({})),
  },
}));

// Mock leaflet plugins
vi.mock('leaflet-minimap', () => ({}));
vi.mock('leaflet-minimap/dist/Control.MiniMap.min.css', () => ({}));
vi.mock('leaflet-mouse-position', () => ({}));
vi.mock('leaflet-draw', () => ({}));
vi.mock('leaflet-draw/dist/leaflet.draw.css', () => ({}));
vi.mock('leaflet/dist/leaflet.css', () => ({}));

describe('MapDisplay', () => {
  const mockGeoLayers = [
    {
      id: 'town_center',
      data: { type: 'FeatureCollection', features: [] },
    },
    {
      id: 'main_road',
      data: { type: 'FeatureCollection', features: [] },
    },
    {
      id: 'residential',
      data: { type: 'FeatureCollection', features: [] },
    },
  ];

  const mockActiveLayers = {
    town_center: true,
    main_road: false,
    residential: false,
  };

  test('renders MapDisplay with correct testid', () => {
    const { getByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={mockActiveLayers} />
    );
    expect(getByTestId('map-display')).toBeInTheDocument();
  });

  test('renders MapContainer with correct props', () => {
    const { getByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={mockActiveLayers} />
    );
    const mapContainer = getByTestId('map-container');
    expect(mapContainer).toHaveAttribute('zoom', '2');
  });

  test('renders TileLayer component', () => {
    const { getByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={mockActiveLayers} />
    );
    expect(getByTestId('tile-layer')).toBeInTheDocument();
  });

  test('renders only active GeoJSON layers', () => {
    const { getAllByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={mockActiveLayers} />
    );
    const geoJsonLayers = getAllByTestId('geojson');
    expect(geoJsonLayers).toHaveLength(1);
    expect(geoJsonLayers[0]).toHaveAttribute('data-layer-id', 'town_center');
  });

  test('does not render inactive GeoJSON layers', () => {
    const { queryAllByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={mockActiveLayers} />
    );
    const geoJsonLayers = queryAllByTestId('geojson');
    const layerIds = geoJsonLayers.map((el) => el.getAttribute('data-layer-id'));
    expect(layerIds).not.toContain('main_road');
    expect(layerIds).not.toContain('residential');
  });

  test('renders all GeoJSON layers when all are active', () => {
    const allActiveLayers = {
      town_center: true,
      main_road: true,
      residential: true,
    };
    const { getAllByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={allActiveLayers} />
    );
    const geoJsonLayers = getAllByTestId('geojson');
    expect(geoJsonLayers).toHaveLength(3);
  });

  test('renders zero GeoJSON layers when none are active', () => {
    const noActiveLayers = {
      town_center: false,
      main_road: false,
      residential: false,
    };
    const { queryAllByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={noActiveLayers} />
    );
    const geoJsonLayers = queryAllByTestId('geojson');
    expect(geoJsonLayers).toHaveLength(0);
  });

  test('applies correct styling to GeoJSON layers', () => {
    const { getByTestId } = render(
      <MapDisplay geoLayers={mockGeoLayers} activeLayers={mockActiveLayers} />
    );
    const geoJsonLayer = getByTestId('geojson');
    expect(geoJsonLayer).toHaveAttribute('style');
  });
});