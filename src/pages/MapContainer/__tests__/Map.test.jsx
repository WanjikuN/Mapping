import { render, screen } from '@testing-library/react';
import Map from '../Map';

test('renders MapDisplay and Layers components', () => {
  render(<Map />);
  expect(screen.getByTestId('map-display')).toBeInTheDocument();
  expect(screen.getByTestId('layers-panel')).toBeInTheDocument();
});