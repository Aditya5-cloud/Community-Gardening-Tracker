# 🌱 Community Garden Tracker

A comprehensive web application for managing community gardens, tracking plants, organizing tasks, and coordinating events. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) with modern UI/UX design.

## ✨ Features

### 🌿 Garden Management
- Create and manage multiple community gardens
- Track garden details, location, and characteristics
- Member management with role-based access
- Garden progress monitoring and achievements

### 🌱 Plant Tracking
- Comprehensive plant database with categories
- Growth stage tracking and measurements
- Health monitoring and issue reporting
- Care requirements and maintenance logs
- Photo documentation and notes

### 📋 Task Management
- Create and assign garden maintenance tasks
- Task scheduling and deadline tracking
- Progress monitoring and completion status
- Weather-dependent task notifications
- Team collaboration and task delegation

### 🎉 Event Management
- Organize community garden events
- Event registration and capacity management
- Volunteer coordination and scheduling
- Event feedback and ratings system
- Calendar integration and reminders

### 👥 User Management
- User registration and authentication
- Role-based access control (Owner, Admin, Member, Viewer)
- User profiles and experience tracking
- Community member search and networking

### 📊 Analytics & Reporting
- Garden progress dashboards
- Plant growth analytics
- Task completion statistics
- Community engagement metrics
- Export and reporting capabilities

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **morgan** - HTTP request logger

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities
- **React Datepicker** - Date inputs
- **React Dropzone** - File uploads
- **React Select** - Select components
- **Recharts** - Data visualization
- **React Leaflet** - Maps integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community-garden-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Server environment
   cd server
   cp env.example .env
   ```
   
   Edit `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/community-garden-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
community-garden-tracker/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   ├── package.json       # Server dependencies
│   └── README.md          # Server documentation
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── gardens/   # Garden management
│   │   │   ├── plants/    # Plant tracking
│   │   │   ├── tasks/     # Task management
│   │   │   ├── events/    # Event management
│   │   │   ├── profile/   # User profile
│   │   │   ├── layout/    # Layout components
│   │   │   └── common/    # Shared components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   ├── package.json       # Client dependencies
│   └── tailwind.config.js # Tailwind configuration
└── README.md              # This file
```

## 🔧 Configuration

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `community-garden-tracker`
3. Update the `MONGODB_URI` in your `.env` file

### Environment Variables

#### Server (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/community-garden-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Garden Endpoints
- `GET /api/gardens` - Get all public gardens
- `GET /api/gardens/:id` - Get garden by ID
- `POST /api/gardens` - Create new garden
- `PUT /api/gardens/:id` - Update garden
- `DELETE /api/gardens/:id` - Delete garden
- `POST /api/gardens/:id/members` - Add member to garden
- `DELETE /api/gardens/:id/members/:userId` - Remove member
- `GET /api/gardens/user/my-gardens` - Get user's gardens

### Plant Endpoints
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

### Task Endpoints
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

### Event Endpoints
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

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Green and nature-inspired theme
- **Typography**: Clean, readable fonts
- **Icons**: Consistent iconography with React Icons
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first design approach

### Components
- **Loading States**: Elegant loading spinners
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for feedback
- **Forms**: Validated form components
- **Modals**: Reusable modal dialogs
- **Cards**: Consistent card layouts
- **Buttons**: Styled button components

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Security headers with helmet
- Request logging with morgan

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Configure MongoDB Atlas connection
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React.js community for the excellent framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All contributors and community members

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Gardening! 🌱** 