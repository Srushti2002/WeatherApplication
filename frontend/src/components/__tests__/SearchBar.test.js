import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';
import { addCity } from '@/lib/api';

// Mock the API module
jest.mock('@/lib/api', () => ({
  addCity: jest.fn()
}));

describe('SearchBar', () => {
  const mockOnCityAdded = jest.fn();

  beforeEach(() => {
    mockOnCityAdded.mockClear();
    addCity.mockClear();
  });

  it('renders search input correctly', () => {
    render(<SearchBar onCityAdded={mockOnCityAdded} />);
    
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
  });

  it('calls addCity and onCityAdded when form is submitted', async () => {
    const mockCity = { city: 'London' };
    addCity.mockResolvedValueOnce(mockCity);
    
    render(<SearchBar onCityAdded={mockOnCityAdded} />);
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    await act(async () => {
      await userEvent.type(input, 'London');
      fireEvent.submit(input.closest('form'));
    });
    
    expect(addCity).toHaveBeenCalledWith('London');
    await waitFor(() => {
      expect(mockOnCityAdded).toHaveBeenCalledWith(mockCity.city);
    });
  });

  it('trims whitespace from search input', async () => {
    const mockCity = { city: 'Paris' };
    addCity.mockResolvedValueOnce(mockCity);
    
    render(<SearchBar onCityAdded={mockOnCityAdded} />);
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    await act(async () => {
      await userEvent.type(input, '  Paris  ');
      fireEvent.submit(input.closest('form'));
    });
    
    expect(addCity).toHaveBeenCalledWith('Paris');
  });

  it('prevents submission with empty input', async () => {
    render(<SearchBar onCityAdded={mockOnCityAdded} />);
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    fireEvent.submit(input.closest('form'));
    
    expect(addCity).not.toHaveBeenCalled();
  });
});