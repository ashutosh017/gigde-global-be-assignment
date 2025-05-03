import { useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Loader2, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const navigate = useNavigate()
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call with delay
    // setTimeout(() => {
    // const users = JSON.parse(localStorage.getItem('taskTrackerUsers') || '[]');
    // const user = users.find(u => u.email === email);

    // if (!user || user.password !== password) {
    //   setError('Invalid email or password');
    //   setLoading(false);
    //   return;
    // }
    const navigate = useNavigate();
    (async () => {
      try {
        const res = await axios.post(`${BACKEND_URL}/auth/signin`, {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token);

        // setLoading(false);
        navigate("/dashboard");
      } catch (error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
    })();
    // Login successful
    // const userForSession = { ...user };
    // delete userForSession.password; // Don't store password in session
    // // localStorage.setItem('taskTrackerUser', JSON.stringify(userForSession));
    // setUser(userForSession);
    // setView("dashboard");
    // setLoading(false);
    // }, 800);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div onSubmit={handleSubmit}>
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

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn size={18} className="mr-2" />
              Login
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
