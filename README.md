# Weather Application

A full-stack weather tracking application built with Next.js and Node.js that allows users to track weather conditions for multiple cities.

## Features

- 🔐 User authentication (signup/login)
- 🌤️ Real-time weather data from OpenWeather API
- 🏙️ Track multiple cities
- 📊 5-day weather forecast
- 🔍 City search with auto-suggestions
- 📱 Responsive design
- 🔄 Auto-refresh weather data

## Tech Stack

### Frontend
- Next.js 14
- React
- Tailwind CSS
- Jest & React Testing Library
- SWR for data fetching

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- OpenWeather API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- OpenWeather API key

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key
PORT=5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd WeatherApplication
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the development servers

```bash
# Start backend server (from backend directory)
nodemon server.js

# Start frontend development server (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/         # React components
│   ├── lib/               # Utilities and API functions
│   └── __tests__/         # Test files
```

### Backend
```
backend/
├── controllers/           # Route controllers
├── middleware/           # Custom middleware
├── models/              # Mongoose models
├── routes/              # API routes
└── __tests__/          # Test files
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new user account
- POST `/api/auth/login` - User login

### Cities
- GET `/api/city` - Get all tracked cities
- POST `/api/city` - Add new city
- DELETE `/api/city/:id` - Remove city

### Weather
- GET `/api/weather/:city` - Get current weather
- GET `/api/weather/forecast/:city` - Get 5-day forecast
- GET `/api/weather/suggest` - Get city suggestions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenWeather API for weather data
- Next.js team for the amazing framework
- MongoDB team for the database
