import axios from "axios";
import { LogOut } from "lucide-react";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { User } from "../types";
import { useNavigate } from "react-router";


export function Header({  handleLogout }:{handleLogout:()=>void}) {
  const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    (async () => {
    try {
       const res = await axios.get(`${BACKEND_URL}/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data)
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
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-indigo-600">Task Tracker</h1>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Hello, <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-600 hover:text-indigo-600"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}