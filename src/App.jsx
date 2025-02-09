import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { auth } from "./Authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Components/Sidebar";
import Home from "./Components/Home";
import Login from "./Authentication/login";
import Register from "./Authentication/Register";
import Dashboard from "./pages/Dashboard";
import Routine from "./pages/Routines";
import Energy from "./pages/Energy";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import RoomDetail from "./pages/RoomDetail";
import { ThemeProviderWrapper } from "./Theme/Theme";
import Footer from "./Components/Footers";
import Chatbot from "./Components/Chatbot";
import Report from "./pages/Report";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProviderWrapper>
      <Router>
        <div>
          {user && <Sidebar />}
          <div>
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/dashboard" /> : <Home />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" /> : <Register />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/room/:roomId"
                element={user ? <RoomDetail /> : <Navigate to="/" />}
              />
              <Route
                path="/routines"
                element={user ? <Routine /> : <Navigate to="/" />}
              />
              <Route
                path="/energy"
                element={user ? <Energy /> : <Navigate to="/" />}
              />
              <Route
                path="/settings"
                element={user ? <Settings /> : <Navigate to="/" />}
              />
              <Route
                path="/profile"
                element={user ? <Profile /> : <Navigate to="/" />}
              />
              <Route
                path="/Ai"
                element={user ? <Chatbot /> : <Navigate to="/" />}
              />
              <Route
                path="/reports"
                element={user ? <Report /> : <Navigate to="/" />}
              />
            </Routes>
            <ToastContainer />
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
