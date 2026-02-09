import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Layers from '../Layers';

vi.mock('react-icons/bs', () => ({
  BsLayersFill: () => <div data-testid="layers-icon" />,
}));

describe('Layers Component', () => {
  const mockGeoLayers = [
    { id: 'town_center', label: 'Town Center' },
    { id: 'main_road', label: 'Main Road' },
    { id: 'residential', label: 'Residential' },
  ];

  const mockActiveLayers = {
    town_center: true,
    main_road: false,
    residential: false,
  };

  let mockToggleLayer;

  beforeEach(() => {
    mockToggleLayer = vi.fn();
  });

  test('renders layers panel container with correct testid', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getByTestId('layers-panel')).toBeInTheDocument();
  });

  test('renders layers heading with correct text and icon', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getByText('Layers')).toBeInTheDocument();
    expect(screen.getByTestId('layers-icon')).toBeInTheDocument();
  });

  test('renders all layer checkboxes matching geoLayers length', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  test('renders all layer labels with correct text', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getByText('Town Center')).toBeInTheDocument();
    expect(screen.getByText('Main Road')).toBeInTheDocument();
    expect(screen.getByText('Residential')).toBeInTheDocument();
  });

  test('displays correct initial checkbox checked state', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  test('calls toggleLayer with correct layer id when checkbox clicked', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(mockToggleLayer).toHaveBeenCalledWith('town_center');
    expect(mockToggleLayer).toHaveBeenCalledTimes(1);
  });

  test('calls toggleLayer independently for each checkbox', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(mockToggleLayer).toHaveBeenNthCalledWith(1, 'main_road');
    expect(mockToggleLayer).toHaveBeenNthCalledWith(2, 'residential');
    expect(mockToggleLayer).toHaveBeenCalledTimes(2);
  });

  test('updates checkbox state when activeLayers prop changes', () => {
    const { rerender } = render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();

    rerender(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={{
          town_center: true,
          main_road: true,
          residential: false,
        }}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked();
  });

  test('renders all checkboxes as checked when all layers are active', () => {
    const allActiveLayers = {
      town_center: true,
      main_road: true,
      residential: true,
    };
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={allActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  test('renders all checkboxes as unchecked when no layers are active', () => {
    const noActiveLayers = {
      town_center: false,
      main_road: false,
      residential: false,
    };
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={noActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  test('renders empty list when geoLayers is empty', () => {
    render(
      <Layers
        geoLayers={[]}
        activeLayers={{}}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes).toHaveLength(0);
  });

  test('renders single layer correctly', () => {
    const singleLayer = [{ id: 'town_center', label: 'Town Center' }];
    const activeLayers = { town_center: true };
    render(
      <Layers
        geoLayers={singleLayer}
        activeLayers={activeLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).toBeChecked();
    expect(screen.getByText('Town Center')).toBeInTheDocument();
  });

  test('maintains correct number of checkboxes when geoLayers prop changes', () => {
    const { rerender } = render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);

    const newGeoLayers = [
      { id: 'town_center', label: 'Town Center' },
      { id: 'main_road', label: 'Main Road' },
    ];
    const newActiveLayers = { town_center: true, main_road: false };

    rerender(
      <Layers
        geoLayers={newGeoLayers}
        activeLayers={newActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  test('renders labels as clickable containers for checkboxes', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const labels = screen.getAllByRole('checkbox').map((checkbox) => checkbox.closest('label'));
    labels.forEach((label) => {
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('cursor-pointer');
    });
  });

  test('handles multiple rapid toggles correctly', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(mockToggleLayer).toHaveBeenCalledTimes(4);
  });

  test('renders correct layer order matching geoLayers array order', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const labels = screen.getAllByRole('checkbox').map((checkbox) => checkbox.closest('label'));
    expect(labels[0].textContent).toContain('Town Center');
    expect(labels[1].textContent).toContain('Main Road');
    expect(labels[2].textContent).toContain('Residential');
  });

  test('renders layers panel with correct styling classes', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const layersPanel = screen.getByTestId('layers-panel');
    expect(layersPanel).toHaveClass('shadow-md', 'bg-white', 'rounded');
  });

  test('clicking checkbox label toggles associated checkbox', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const labels = screen.getAllByRole('checkbox').map((checkbox) => checkbox.closest('label'));
    fireEvent.click(labels[1]);
    expect(mockToggleLayer).toHaveBeenCalledWith('main_road');
  });

  test('renders layer with special characters in label correctly', () => {
    const specialLayers = [{ id: 'special', label: 'Layer & Complex (Name)' }];
    const activeLayers = { special: false };
    render(
      <Layers
        geoLayers={specialLayers}
        activeLayers={activeLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(screen.getByText('Layer & Complex (Name)')).toBeInTheDocument();
  });

  test('does not call toggleLayer on initial render', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(mockToggleLayer).not.toHaveBeenCalled();
  });

  test('handles layers with long label text correctly', () => {
    const longLabelLayers = [
      {
        id: 'long',
        label: 'This is a very long layer label that should still render correctly without issues',
      },
    ];
    const activeLayers = { long: false };
    render(
      <Layers
        geoLayers={longLabelLayers}
        activeLayers={activeLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    expect(
      screen.getByText('This is a very long layer label that should still render correctly without issues')
    ).toBeInTheDocument();
  });

  test('toggleLayer receives correct layer id for each checkbox click event', () => {
    render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(mockToggleLayer.mock.calls).toEqual([
      ['town_center'],
      ['main_road'],
      ['residential'],
    ]);
  });

  test('renders correctly with geoLayers in different order', () => {
    const reorderedLayers = [
      { id: 'residential', label: 'Residential' },
      { id: 'town_center', label: 'Town Center' },
      { id: 'main_road', label: 'Main Road' },
    ];
    const activeLayers = {
      residential: false,
      town_center: true,
      main_road: false,
    };
    render(
      <Layers
        geoLayers={reorderedLayers}
        activeLayers={activeLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  test('each checkbox maintains independent state', () => {
    const { rerender } = render(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={mockActiveLayers}
        toggleLayer={mockToggleLayer}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    expect(mockToggleLayer).toHaveBeenCalledWith('main_road');

    rerender(
      <Layers
        geoLayers={mockGeoLayers}
        activeLayers={{ ...mockActiveLayers, main_road: true }}
        toggleLayer={mockToggleLayer}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });
});