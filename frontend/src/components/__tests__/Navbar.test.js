import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar';
import { isAuthenticated } from '@/lib/auth';
import { logoutUser } from '@/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock auth and api
jest.mock('@/lib/auth', () => ({
  isAuthenticated: jest.fn()
}));

jest.mock('@/lib/api', () => ({
  logoutUser: jest.fn()
}));

describe('Navbar', () => {
  const mockRouter = {
    replace: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    isAuthenticated.mockReturnValue(false);
    mockRouter.replace.mockClear();
    logoutUser.mockClear();
  });

  it('shows login and signup when not authenticated', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByLabelText(/open menu/i));
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign ?up/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it('shows dashboard and logout when authenticated', () => {
    isAuthenticated.mockReturnValue(true);
    render(<Navbar />);
    
    fireEvent.click(screen.getByLabelText(/open menu/i));
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    isAuthenticated.mockReturnValue(true);
    render(<Navbar />);
    
    fireEvent.click(screen.getByLabelText(/open menu/i));
    fireEvent.click(screen.getByText(/logout/i));
    
    expect(logoutUser).toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('closes menu when clicking outside', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByLabelText(/open menu/i));
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText(/home/i)).not.toBeInTheDocument();
  });
});