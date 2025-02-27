/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

const mockUpdateSuggestions = jest.fn();
const mockSelectedHabitat = null;

jest.mock('@/context/PokemonContext', () => ({
  usePokemonContext: () => ({
    updateSuggestions: mockUpdateSuggestions,
    selectedHabitat: mockSelectedHabitat
  })
}));

// En src/components/__tests__/SearchBar.test.tsx
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    return <img data-testid="next-image" data-fill={fill ? "true" : undefined} {...rest} />;
  }
}));

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnHabitatFilter = jest.fn().mockResolvedValue(undefined);
  const mockSuggestions = [
    { id: 1, name: 'pikachu', image: '/pikachu.png' },
    { id: 2, name: 'bulbasaur', image: '/bulbasaur.png' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with default props', () => {
    render(<SearchBar selectedHabitat={null} />);
    
    expect(screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  test('renders with initial query', () => {
    render(<SearchBar initialQuery="pikachu" selectedHabitat={null} />);
    
    const input = screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)');
    expect(input).toHaveValue('pikachu');
  });

  test('handles input change correctly', async () => {
    render(<SearchBar onSearch={mockOnSearch} selectedHabitat={null} />);
    
    const input = screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)');
    await userEvent.type(input, 'pika');
    
    expect(input).toHaveValue('pika');
    expect(mockUpdateSuggestions).toHaveBeenCalledWith('pika');
  });

  test('submits search when form is submitted', async () => {
    render(<SearchBar onSearch={mockOnSearch} selectedHabitat={null} />);
    
    const input = screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)');
    await userEvent.type(input, 'pikachu');
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  test('clears search input when clear button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} selectedHabitat={null} />);
    
    const input = screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)');
    await userEvent.type(input, 'pikachu');
    
    const clearButton = screen.getByLabelText('Clear search');
    await userEvent.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('displays and handles suggestions correctly', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        suggestions={mockSuggestions}
        selectedHabitat={null}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)');
    
    await userEvent.click(input);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    
    await userEvent.click(screen.getByText('pikachu'));
    
    expect(input).toHaveValue('pikachu');
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  test('opens habitat dropdown when filter button is clicked', async () => {
    render(<SearchBar onHabitatFilter={mockOnHabitatFilter} selectedHabitat={null} />);
    
    const filterButton = screen.getByText('Filter');
    await userEvent.click(filterButton);
    
    await waitFor(() => {
      expect(screen.getByText(/cave/i)).toBeInTheDocument();
      expect(screen.getByText(/forest/i)).toBeInTheDocument();
      expect(screen.getByText(/grassland/i)).toBeInTheDocument();
    });
  });

  });


  test('disables inputs when loading', () => {
    render(<SearchBar isLoading={true} selectedHabitat={null} />);
    
    expect(screen.getByPlaceholderText('Enter Pokemon name (e.g. pika)')).toBeDisabled();
    expect(screen.getByText('Search')).toBeDisabled();
  });
