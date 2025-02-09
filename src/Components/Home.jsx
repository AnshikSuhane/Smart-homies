
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Settings, Activity } from 'lucide-react';
import './Home.css'; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">SmartHome Manager</h1>
          <p className="home-subtitle">Control your entire home from one place</p>
          <Link to="/login" className="home-button">
            Get Started
          </Link>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <HomeIcon className="feature-icon" />
            <h3 className="feature-title">Smart Control</h3>
            <p className="feature-description">
              Manage all your smart devices from a single, user-friendly dashboard.
            </p>
          </div>

          <div className="feature-card">
            <Settings className="feature-icon" />
            <h3 className="feature-title">Automation</h3>
            <p className="feature-description">
              Create custom routines and automate your daily tasks with ease.
            </p>
          </div>

          <div className="feature-card">
            <Activity className="feature-icon" />
            <h3 className="feature-title">Energy Monitoring</h3>
            <p className="feature-description">
              Track, analyze, and optimize your energy consumption in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


