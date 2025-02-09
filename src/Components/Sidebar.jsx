import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Authentication/firebase";
import { toast } from "react-toastify";
import { useThemeContext } from "../Theme/Theme";
import { Button } from "./ui/button";
import {
  Activity,
  Calendar,
  Home,
  LogOut,
  Settings,
  User,
  Sun,
  Moon,
  Bot,
  Menu,
  X,
} from "lucide-react";
import Logo from "../assets/logo.jpg";

const Navbar = () => {
  const { toggleColorMode, mode } = useThemeContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out", { position: "top-center" });
      navigate("/");
    } catch (error) {
      toast.error("Error signing out", { position: "top-center" });
      console.error(error.message); // Use console.error for errors
    }
  };

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/routines", icon: <Calendar size={20} />, label: "Routines" },
    { path: "/energy", icon: <Activity size={20} />, label: "Energy" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
    { path: "/ai", icon: <Bot size={20} />, label: "AI Assistance" },
  ];

  return (
    <nav className="bg-gray-400 text-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center"> {/* Combined flex container */}
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="SmartHome Logo"
            className="h-28 w-20 md:h-10 rounded-2xl transition-all duration-300 hover:scale-110" // Increased size (h-24 w-24)
          />
          <h1 className="text-2xl font-bold tracking-wide">SmartHome Manager</h1>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-md"
                    : "hover:bg-indigo-500 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button className="text-white" onClick={toggleColorMode}>
            {mode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg shadow-md transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Menu Button & Content */}
        <div className="md:hidden flex items-center"> {/* Ensure alignment */}
          <button
            className="text-gray-900 p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {menuOpen && (
            <div className="absolute top-full left-0 right-0 bg-gray-400 p-4 mt-1 shadow-lg rounded-b-lg"> {/* Positioned menu */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-white text-indigo-600 shadow-md"
                          : "hover:bg-indigo-500 hover:text-white"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                <div className="flex items-center justify-between pt-4 border-t border-gray-500">
                  <Button
                    onClick={toggleColorMode}
                    className="p-2 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-gray-200"
                  >
                    {mode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                  </Button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg shadow-md transition-all"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;