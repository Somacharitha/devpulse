DevPulse 🚀

AI-Powered GitHub Developer Analytics Platform

Analyze GitHub profiles, discover developer insights, compare programmers, and visualize coding activity through an interactive analytics dashboard.

📖 Overview


DevPulse is a full-stack developer analytics platform that transforms raw GitHub profile data into meaningful insights. By leveraging GitHub APIs, AI-powered analysis, and interactive visualizations, DevPulse helps developers, recruiters, mentors, and hiring teams better understand a developer's technical profile.

The platform provides detailed repository analytics, programming language distribution, profile comparisons, AI-generated insights, favorites management, and downloadable reports—all in a modern, user-friendly dashboard.

✨ Features

🔍 GitHub Profile Analysis
Search any public GitHub user
View profile information
Analyze repositories and contributions
Track followers and following statistics

📊 Developer Analytics Dashboard
Repository statistics
Most starred repositories
Fork analysis
Activity overview
Developer performance metrics

🧠 AI-Powered Insights
Automated profile analysis
Technology stack identification
Strength and focus area detection
Personalized developer summaries

📈 Language Analytics
Programming language distribution
Interactive charts and graphs
Technology usage trends

⚖️ Developer Comparison
Compare multiple GitHub profiles
Repository comparison
Follower comparison
Technology stack comparison

❤️ Favorites System
Save favorite developer profiles
Quick access dashboard
Personalized tracking

🔐 Authentication & Security
JWT Authentication
Secure login and signup
Protected routes
Session management

📄 Export Functionality
Export analytics reports as PDF
Share developer insights

⚡ Performance Optimization
API Caching
Rate Limiting
Optimized API requests
Faster dashboard loading

🏗️ System Architecture
User
 │
 ▼
React Frontend
 │
 ▼
Node.js + Express Backend
 │
 ├── GitHub REST API
 │
 └── MongoDB Database
 │
 ▼
Analytics Engine
 │
 ▼
Interactive Dashboard

🛠️ Tech Stack
Frontend
React.js
JavaScript (ES6+)
HTML5
CSS3
Axios
React Router
Chart.js / Recharts
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
JWT (JSON Web Token)
APIs
GitHub REST API
Tools
Git
GitHub
Postman

🚀 Key Challenges Solved
Problem

GitHub profiles contain a large amount of developer information, but extracting meaningful insights manually is time-consuming for recruiters, mentors, and developers.


Solution


DevPulse converts raw GitHub data into actionable analytics by:

Aggregating profile information
Visualizing repository metrics
Generating AI-based insights
Comparing developer profiles
Providing exportable reports


🔧 Installation
Clone Repository
git clone https://github.com/Somacharitha/devpulse.git
Navigate to Project
cd devpulse
Install Frontend Dependencies
npm install
Install Backend Dependencies
cd server
npm install
Configure Environment Variables

Create a .env file:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GITHUB_TOKEN=your_github_token
Start Backend
npm run server
Start Frontend
npm start

📂 Project Structure
devpulse/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── config/
│
└── README.md

🎯 Future Enhancements
GitHub Contribution Heatmaps
AI Resume Suggestions
GitHub Profile Score
Team Analytics Dashboard
GitHub Organization Analysis
Dark/Light Theme Support
AI Career Recommendations
Real-Time GitHub Activity Tracking
📈 Learning Outcomes

This project strengthened my understanding of:

Full Stack Development
REST API Integration
Authentication & Authorization
Database Design
Data Visualization
Performance Optimization
AI Integration Concepts
Software Architecture
🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Nagareddy Somacharitha

Final Year Computer Science Student.

Passionate about Full Stack Development, Cloud Computing, AI, and Software Engineering.

⭐ If you found this project useful, consider giving it a star.
