# MotoGP Open API

A RESTful API for accessing MotoGP rider data, including profiles, teams, statistics, and standings. Built with Node.js, Express, and Sequelize.

## Features

- User authentication and API key management
- CRUD operations for riders, teams, standings, and statistics
- Admin panel for user and API key management
- Request logging
- Frontend interface for testing API endpoints

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finalproject
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up PostgreSQL database:
   - Create a database named `motogp`
   - Update the database credentials in `backend/.env` if necessary

4. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Seed the database with initial data:
   ```bash
   npx sequelize-cli db:seed:all
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

2. Start the React frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on http://localhost:3000

## API Documentation

### Authentication

- **Register**: `POST /auth/register`
- **Login**: `POST /auth/login`
- **Generate API Key**: `POST /api-keys/generate` (requires JWT token)

### Public Endpoints (require X-API-Key header)

- **Get All Riders**: `GET /api/riders`
- **Get Rider by ID**: `GET /api/riders/:id`
- **Get All Teams**: `GET /api/teams`
- **Get Standings**: `GET /api/standings`
- **Get Statistics**: `GET /api/statistics`

### Admin Endpoints (require JWT token with admin role)

- **Get Users**: `GET /admin/users`
- **Get API Keys**: `GET /admin/api-keys`
- **Toggle API Key**: `PUT /admin/api-keys/:id/toggle`
- **CRUD for Riders**: `/admin/riders`
- **CRUD for Teams**: `/admin/teams`
- **Get Logs**: `GET /admin/logs`

## Usage

1. Register a new account via the frontend or API
2. Login to get a JWT token
3. Generate an API key using the JWT token
4. Use the API key in the X-API-Key header for API requests
5. Test endpoints using the frontend interface

## Project Structure

```
finalproject/
├── backend/
│   ├── config/
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Technologies Used

- **Backend**: Node.js, Express.js, Sequelize, PostgreSQL
- **Frontend**: React.js
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.