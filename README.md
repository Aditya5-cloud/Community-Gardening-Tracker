🌱 Community Garden Tracker

A comprehensive MERN stack application for managing community gardens, tracking plants, organizing tasks, and coordinating events.
This app provides a full-stack solution for garden members and admins to collaborate effectively.

📸 Project Screenshots

Main Dashboard:
<img width="1908" height="911" alt="image" src="https://github.com/user-attachments/assets/cb76641a-3a5b-4c5b-a9d5-36c9de023d2c" />

Community Dashboard:
<img width="1912" height="897" alt="image" src="https://github.com/user-attachments/assets/4d8d0e7f-049c-436f-ab04-aea6adee4481" />

🛠️ Tech Stack

<img width="693" height="435" alt="image" src="https://github.com/user-attachments/assets/9aa43fe4-92c9-432b-ba6b-5caf3a27a490" />




✨ Key Features

Garden & Plot Management: Create, track, and manage multiple community gardens and member plots.
Plant Tracking: Maintain a database of plants with growth stages, health monitoring, and care logs.
Task Coordination: Create and assign garden tasks with scheduling, progress tracking, and deadlines.
Chat Integration: Community members can chat in about the community works.
User Roles: Secure authentication with role-based access.
Analytics: View dashboards for garden progress, plant health, and task completion.


🚀 How to Run Locally

Get the project up and running on your local machine.

Clone the repo

git clone [https://github.com/Aditya5-cloud/Community-Gardening-Tracker.git]

1.cd Community-Gardening-Tracker



2.Install Server Dependencies

cd server
npm install


3.Install Client Dependencies

cd ../client
npm install


4.Set up Environment Variables

Create a .env file in the /server folder.

Add your MongoDB connection string and a JWT secret:

MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key_here


5.Run the App

--Run the backend (from the /server folder):

npm run dev


--Run the frontend (from the /client folder):

npm start


Access the app at http://localhost:3000


🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a new feature branch, and submit a pull request.


