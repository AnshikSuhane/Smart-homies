/* eslint-disable react/prop-types */

import {
    Activity,
    Calendar,
    Home,
    LogOut,
    Menu,
    Settings,
    User,
    X,
    Sun,
    Moon
  } from "lucide-react";
  import { useState } from "react";
  import { NavLink, useNavigate } from "react-router-dom";
  import { signOut } from "firebase/auth";
  import { auth } from "../Authentication/firebase";
  import { toast } from "react-toastify";
  import { useThemeContext } from "../Theme/Theme";
  
  const Sidebar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { toggleColorMode, mode } = useThemeContext();
    const navigate = useNavigate();
  
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        toast.success("Successfully signed out", { position: "top-center" });
        navigate("/");
      } catch (error) {
        toast.error("Error signing out", { position: "top-center" });
        console.log(error.message);
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <button
          type="button"
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {isSidebarOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
  
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 bg-indigo-600">
              <h1 className="text-xl font-bold text-white">SmartHome Manager</h1>
              <div className="flex gap-3">
                <button className="text-white" onClick={toggleColorMode}>
                  {mode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
            </div>
  
            <ul className="mt-8 flex-1 space-y-2">
              {[
                { path: "/", icon: <Home size={20} />, label: "Dashboard" },
                { path: "/routines", icon: <Calendar size={20} />, label: "Routines" },
                { path: "/energy", icon: <Activity size={20} />, label: "Energy" },
                { path: "/profile", icon: <User size={20} />, label: "Profile" },
                { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-x-4 p-3 rounded-lg transition-all duration-200 ${
                        isActive ? "bg-indigo-500 text-white" : "text-gray-300 hover:bg-gray-700"
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.icon} {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
  
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 lg:pl-64 p-4">
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  