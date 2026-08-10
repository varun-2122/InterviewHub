import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  it('renders correctly', () => {
    const { container } = render(<Loader />);
    
    // Check if the svg (Loader2Icon) is present
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('animate-spin');
    
    // Check if container has correct flex classes
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
