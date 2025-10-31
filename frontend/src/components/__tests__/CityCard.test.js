import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CityCard from '../CityCard';
import * as api from '@/lib/api';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  getWeatherByCity: jest.fn(),
  fetchForecast: jest.fn(),
}));

describe('CityCard', () => {
  const mockCity = {
    name: 'London'
  };

  const mockWeatherData = {
    name: 'London',
    country: 'UK',
    temperature: 20,
    description: 'Cloudy',
    humidity: 70,
    windSpeed: 5,
    icon: '04d',
    sunrise: Math.floor(Date.now() / 1000),
    sunset: Math.floor(Date.now() / 1000) + 43200 // 12 hours later
  };

  const mockOnDelete = jest.fn();
  
  const mockForecastData = [
    { 
      date: '2025-10-31', 
      temp_max: 22, 
      temp_min: 18, 
      description: 'Cloudy',
      icon: '04d' 
    },
    { 
      date: '2025-11-01', 
      temp_max: 24, 
      temp_min: 20, 
      description: 'Sunny',
      icon: '01d' 
    }
  ];

  beforeEach(() => {
    mockOnDelete.mockClear();
    api.getWeatherByCity.mockResolvedValue(mockWeatherData);
    api.fetchForecast.mockResolvedValue(mockForecastData);
  });

  it('renders loading state initially', async () => {
    let resolved = false;
    api.getWeatherByCity.mockImplementationOnce(() => new Promise((resolve) => {
      setTimeout(() => {
        resolved = true;
        resolve(mockWeatherData);
      }, 100);
    }));

    render(<CityCard city={mockCity} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(/loading weather/i)).toBeInTheDocument();

    // Wait for the mock to resolve
    await waitFor(() => expect(resolved).toBe(true));
  });

  it('renders city information after loading', async () => {
    render(<CityCard city={mockCity} />);

    await waitFor(() => {
      // Location
      expect(screen.getByText(mockWeatherData.name)).toBeInTheDocument();
      expect(screen.getByText(`(${mockWeatherData.country})`)).toBeInTheDocument();
      // Weather info
      expect(screen.getByText(`${Math.round(mockWeatherData.temperature)}°C`)).toBeInTheDocument();
      expect(screen.getAllByText(mockWeatherData.description)[0]).toBeInTheDocument();
      // Details
      expect(screen.getByText(`${mockWeatherData.humidity}%`)).toBeInTheDocument();
      expect(screen.getByText(`${mockWeatherData.windSpeed} m/s`)).toBeInTheDocument();
    });
  });

  it('renders weather icon after loading', async () => {
    render(<CityCard city={mockCity} />);

    await waitFor(() => {
      const icons = screen.getAllByAltText(mockWeatherData.description);
      expect(icons[0]).toHaveAttribute(
        'src',
        `https://openweathermap.org/img/wn/${mockWeatherData.icon}@2x.png`
      );
    });
  });

  it('renders forecast after loading', async () => {
    // Setup API mocks
    api.getWeatherByCity.mockResolvedValue(mockWeatherData);
    api.fetchForecast.mockResolvedValue(mockForecastData);

    render(<CityCard city={mockCity} />);

    await waitFor(() => {
      // Check forecast title
      expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
      
      // Check forecast data
      mockForecastData.forEach(day => {
        expect(screen.getByText(`${Math.round(day.temp_max)}° / ${Math.round(day.temp_min)}°`)).toBeInTheDocument();
      });
    });
  });

  it('handles API errors gracefully', async () => {
    api.getWeatherByCity.mockRejectedValueOnce(new Error('API Error'));
    api.fetchForecast.mockRejectedValueOnce(new Error('API Error'));

    render(<CityCard city={mockCity} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(screen.getByText(/unable to fetch weather data/i)).toBeInTheDocument();
    });
  });

  it('renders loading states', async () => {
    // Have weather data resolve immediately but keep forecast loading
    api.getWeatherByCity.mockResolvedValueOnce(mockWeatherData);
    api.fetchForecast.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<CityCard city={mockCity} />);

    await waitFor(() => {
      expect(screen.getByText(/loading forecast/i, { exact: false })).toBeInTheDocument();
    });
  });
});