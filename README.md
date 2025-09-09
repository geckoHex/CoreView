# CoreView - Azure-like Management Portal

A modern web interface for managing and monitoring your Flask backend services, designed with Microsoft Azure's clean and professional UI aesthetic.

## Features

### 🔐 Authentication
- Secure login system with session management
- Auto-logout after 5 minutes of inactivity
- Protected routes and API endpoints

### 📊 Dashboard
- Real-time system health monitoring
- Live server time display
- Quick access to all services
- Service status indicators

### 🛠️ Available Services

#### Echo Service
- Test message echoing functionality
- Copy results to clipboard
- Usage examples and documentation

#### Text Reverser
- Reverse any text string character by character
- Side-by-side input/output comparison
- Real-time character count

#### Calculator
- Server-side mathematical operations (addition)
- Calculation history with reusable results
- Support for decimal and negative numbers

#### System Clock
- Real-time server time monitoring
- Local vs server time comparison
- Auto-refresh capabilities
- Time synchronization status

#### Health Monitor
- Continuous server health monitoring
- Response time tracking
- Uptime percentage calculation
- Historical health check data
- Automatic monitoring with configurable intervals

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Session Management** - Built-in authentication

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.7+
- pip for Python packages

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install flask flask-cors python-dotenv
   ```

3. Create a `.env` file with your credentials:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd core-view-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. You'll be redirected to the login page
3. Enter your credentials (from the `.env` file)
4. Access the dashboard and explore the available services

## API Endpoints

### Authentication
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /auth` - Check authentication status

### Services
- `GET /health` - Server health check
- `GET /echo?message=text` - Echo service
- `GET /reverse?message=text` - Text reversal
- `GET /add?num1=1&num2=2` - Addition calculator
- `GET /clock` - Server time

## UI Design Features

### Azure-inspired Design
- Clean, professional interface
- Consistent color scheme (blues, grays)
- Rounded corners and subtle shadows
- Proper spacing and typography

### Responsive Layout
- Mobile-friendly navigation
- Collapsible sidebar
- Adaptive grid layouts
- Touch-friendly controls

### User Experience
- Loading states and animations
- Error handling with clear messages
- Copy-to-clipboard functionality
- Real-time updates
- Keyboard navigation support

## Development

### Project Structure
```
CoreView/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── commands/
│   │   └── info.py         # Time utilities
│   └── .env                # Environment variables
└── core-view-frontend/
    ├── src/
    │   ├── app/            # Next.js app directory
    │   ├── components/     # Reusable components
    │   ├── contexts/       # React contexts
    │   └── lib/            # Utilities and API
    ├── package.json
    └── tailwind.config.js
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Features

- Session-based authentication
- CORS protection
- Input validation
- Automatic session expiration
- Secure credential handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License.

## Support

For support or questions, please check the documentation or create an issue in the repository.