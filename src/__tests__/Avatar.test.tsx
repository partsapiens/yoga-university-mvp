import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from '@/components/Avatar';

describe('Avatar Component', () => {
  it('renders with idle state by default', () => {
    const { container } = render(<Avatar state="idle" />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders different states correctly', () => {
    const states = ['idle', 'speaking', 'listening', 'thinking'] as const;
    
    states.forEach(state => {
      const { container } = render(<Avatar state={state} key={state} />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  it('applies size classes correctly', () => {
    const { container } = render(<Avatar state="idle" size="lg" />);
    const avatar = container.querySelector('div');
    expect(avatar).toHaveClass('w-32', 'h-32');
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar state="idle" className="custom-class" />);
    const avatar = container.querySelector('div');
    expect(avatar).toHaveClass('custom-class');
  });
});