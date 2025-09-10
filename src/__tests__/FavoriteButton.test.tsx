import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FavoriteButton from '../components/PoseLibrary/FavoriteButton';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('FavoriteButton', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('renders unfavorited state by default', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    render(<FavoriteButton poseId="test-pose-1" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☆');
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');
  });

  it('renders favorited state when pose is in favorites', () => {
    localStorageMock.getItem.mockReturnValue('["test-pose-1"]');
    render(<FavoriteButton poseId="test-pose-1" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('★');
    expect(button).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('adds pose to favorites when clicked', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    render(<FavoriteButton poseId="test-pose-1" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'yogaFavorites',
      '["test-pose-1"]'
    );
  });

  it('removes pose from favorites when clicked if already favorited', () => {
    localStorageMock.getItem.mockReturnValue('["test-pose-1", "test-pose-2"]');
    render(<FavoriteButton poseId="test-pose-1" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'yogaFavorites',
      '["test-pose-2"]'
    );
  });

  it('handles malformed localStorage data', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    
    // Should not throw error
    expect(() => {
      render(<FavoriteButton poseId="test-pose-1" />);
    }).not.toThrow();
  });

  it('applies custom className', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    render(<FavoriteButton poseId="test-pose-1" className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});