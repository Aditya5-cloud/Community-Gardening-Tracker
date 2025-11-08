# Community Garden Tracker - Backend Server

A comprehensive REST API for managing community gardens, plants, tasks, events, and user interactions.

## Features

- **User Management**: Registration, authentication, profile management
- **Garden Management**: Create, update, and manage community gardens
- **Plant Tracking**: Monitor plant growth, health, and care requirements
- **Task Management**: Assign and track garden maintenance tasks
- **Event Management**: Organize and manage community events
- **Role-based Access Control**: Owner, admin, member, and viewer roles
- **Real-time Updates**: Track changes and progress
- **Search and Filtering**: Advanced search capabilities
- **File Upload Support**: Image and document management

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **morgan** - HTTP request logger

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community-garden-tracker/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/community-garden-tracker
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `community-garden-tracker`

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Gardens
- `GET /api/gardens` - Get all public gardens
- `GET /api/gardens/:id` - Get garden by ID
- `POST /api/gardens` - Create new garden
- `PUT /api/gardens/:id` - Update garden
- `DELETE /api/gardens/:id` - Delete garden
- `POST /api/gardens/:id/members` - Add member to garden
- `DELETE /api/gardens/:id/members/:userId` - Remove member
- `GET /api/gardens/user/my-gardens` - Get user's gardens

### Plants
- `GET /api/plants` - Get all plants (with filters)
- `GET /api/plants/:id` - Get plant by ID
- `POST /api/plants` - Add new plant
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Delete plant
- `POST /api/plants/:id/notes` - Add note to plant
- `POST /api/plants/:id/measurements` - Record measurements
- `POST /api/plants/:id/health-issues` - Record health issue
- `PUT /api/plants/:id/growth-stage` - Update growth stage
- `GET /api/plants/garden/:gardenId` - Get plants by garden

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/assign` - Assign task to user
- `POST /api/tasks/:id/start` - Start task
- `POST /api/tasks/:id/complete` - Complete task
- `POST /api/tasks/:id/notes` - Add note to task
- `GET /api/tasks/garden/:gardenId` - Get tasks by garden
- `GET /api/tasks/user/my-tasks` - Get user's assigned tasks

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/volunteer` - Volunteer for event
- `POST /api/events/:id/feedback` - Add feedback to event
- `GET /api/events/garden/:gardenId` - Get events by garden
- `GET /api/events/user/my-events` - Get user's events
- `GET /api/events/upcoming` - Get upcoming events

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/search` - Search users
- `GET /api/users/garden/:gardenId/members` - Get garden members
- `GET /api/users/stats` - Get user statistics
- `POST /api/users/:id/deactivate` - Deactivate user account
- `POST /api/users/:id/activate` - Activate user account (admin only)

## Data Models

### User
- Authentication fields (username, email, password)
- Profile information (firstName, lastName, bio, experience)
- Role-based access (admin, moderator, member)
- Garden associations and interests

### Garden
- Basic information (name, description, location)
- Physical characteristics (size, soil type, climate)
- Member management with roles
- Budget tracking and achievements

### Plant
- Plant information (name, category, variety)
- Growth tracking (stages, measurements, health)
- Care requirements (water, sun, fertilizer needs)
- Notes and observations

### Task
- Task details (title, description, category)
- Assignment and scheduling
- Progress tracking and completion
- Weather dependencies and instructions

### Event
- Event information (title, description, type)
- Registration and capacity management
- Volunteer coordination
- Feedback and ratings

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Security headers with helmet
- Request logging with morgan

## Error Handling

- Comprehensive error middleware
- Validation error responses
- Proper HTTP status codes
- Detailed error messages for debugging

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Code Structure
``` 
server/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set secure JWT secret

2. **Security Considerations**
   - Use HTTPS in production
   - Implement rate limiting
   - Set up proper CORS configuration
   - Use environment variables for secrets

3. **Performance Optimization**
   - Enable compression
   - Implement caching
   - Optimize database queries
   - Use connection pooling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 