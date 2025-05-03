
import { useEffect } from "react";
import axios from "axios";


import { Header } from "./components/Header";
import {  useNavigate } from "react-router";
const BACKEND_URL = "http://localhost:3000";
// Main App Component
export default function App() {
  const navigate = useNavigate();
  // const [view, setView] = useState("login"); // login, signup, dashboard

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    (async () => {
    try {
      await axios.get(`${BACKEND_URL}/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return navigate("/dashboard")
      // if (res.status === 401 || res.status === 403) {
      //   // handleLogout();
   
      // }
    } catch (error) {
      console.log("redirecting to login page")
      return navigate("/login")
    }
    })();
    // const savedUser = localStorage.getItem("taskTrackerUser");
    // if (savedUser) {
    //   setUser(JSON.parse(savedUser));
    //   setView("dashboard");
    // }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // setUser(null);
    // setView("login");
    // localStorage.removeItem("taskTrackerUser");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header  handleLogout={handleLogout} />

      <main className="container mx-auto py-6 px-4">
        {/* {view === "login" && <Login setUser={setUser} setView={setView} />}
        {view === "signup" && <Signup setUser={setUser} setView={setView} />}
        {view === "dashboard" && user && <Dashboard />} */}
      </main>

      <footer className="bg-white py-4 text-center text-gray-500 border-t absolute w-screen bottom-0">
        Task Tracker &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// Header Component

// Login Component


// Signup Component


// Dashboard Component


// Task Component

