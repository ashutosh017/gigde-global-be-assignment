import { useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Loader2, User } from "lucide-react";
import { useNavigate } from "react-router";

export function Signup({  }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const navigate = useNavigate();
    const countries = [
      "United States",
      "Canada",
      "United Kingdom",
      "Australia",
      "Germany",
      "France",
      "Japan",
      "Brazil",
      "India",
      "Other",
    ];
  
    const handleSubmit = (e:any) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      console.log("handlesubmit called inside signup1");
  
      // Simulate API call with delay
      // setTimeout(() => {
      // const users = JSON.parse(localStorage.getItem('taskTrackerUsers') || '[]');
  
      // Check if email already exists
      // if (users.some(user => user.email === email)) {
      //   setError('Email already in use');
      //   setLoading(false);
      //   return;
      // }
  
      // Create new user with empty projects
      const newUser = {
        name,
        email,
        password,
        country,
      };
  
      // Save to "database"
      // users.push(newUser);
      // localStorage.setItem('taskTrackerUsers', JSON.stringify(users));
  
      (async () => {
        console.log("handlesubmit called inside signup2");
  
        try {
          console.log("handlesubmit called inside signup3");
          await axios.post(`${BACKEND_URL}/auth/signup`, {
            ...newUser,
          });
        } catch (error) {
          setError("Email already in use");
          setLoading(false);
        }
  
        // Log in the new user
        console.log("handlesubmit called inside signup4");
        await axios.post(`${BACKEND_URL}/auth/signin`, {
          email: newUser.email,
          password: newUser.password,
        });
      })();
      // const userForSession = { ...newUser };
      // delete userForSession.password; // Don't store password in session
      // localStorage.setItem('taskTrackerUser', JSON.stringify(userForSession));
  
      // setUser(userForSession);
      // setView("dashboard");
      setLoading(false);
      // }, 800);
    };
  
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
  
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
  
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
  
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
  
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              <>
                <User size={18} className="mr-2" />
                Sign Up
              </>
            )}
          </button>
        </div>
  
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }