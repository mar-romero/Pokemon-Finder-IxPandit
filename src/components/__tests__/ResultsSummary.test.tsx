
import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsSummary from '../ResultsSummary';

describe('ResultsSummary', () => {
  test('renders with total results only', () => {
    render(<ResultsSummary totalResults={42} />);
    expect(screen.getByText('Found 42 Pokemon')).toBeInTheDocument();
  });

  test('renders with search query', () => {
    render(<ResultsSummary totalResults={5} searchQuery="pika" />);
    expect(screen.getByText('Found 5 Pokemon matching "pika"')).toBeInTheDocument();
  });

  test('renders with habitat', () => {
    render(<ResultsSummary totalResults={10} selectedHabitat="forest" />);
    expect(screen.getByText('Found 10 Pokemon in forest habitat')).toBeInTheDocument();
  });

  test('renders with hyphenated habitat name', () => {
    render(<ResultsSummary totalResults={7} selectedHabitat="rough-terrain" />);
    expect(screen.getByText('Found 7 Pokemon in rough terrain habitat')).toBeInTheDocument();
  });

  test('renders with both search query and habitat', () => {
    render(
      <ResultsSummary 
        totalResults={3} 
        searchQuery="char" 
        selectedHabitat="cave" 
      />
    );
    expect(screen.getByText('Found 3 Pokemon matching "char" in cave habitat')).toBeInTheDocument();
  });

  test('renders no results message', () => {
    render(<ResultsSummary totalResults={0} />);
    expect(screen.getByText('No Pokemon found')).toBeInTheDocument();
  });

  test('renders no results with search query', () => {
    render(<ResultsSummary totalResults={0} searchQuery="xyz" />);
    expect(screen.getByText('No Pokemon found matching "xyz"')).toBeInTheDocument();
  });
});
