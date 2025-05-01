// @ts-nocheck

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  LogIn,
  LogOut,
  Plus,
  Trash,
  User,
} from "lucide-react";
const BACKEND_URL = "http://localhost:3000";
// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); // login, signup, dashboard

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem("token")(async () => {
      const res = await axios.get(`${BACKEND_URL}/projects`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    })();
    const savedUser = localStorage.getItem("taskTrackerUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView("dashboard");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView("login");
    localStorage.removeItem("taskTrackerUser");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} handleLogout={handleLogout} />

      <main className="container mx-auto py-6 px-4">
        {view === "login" && <Login setUser={setUser} setView={setView} />}
        {view === "signup" && <Signup setUser={setUser} setView={setView} />}
        {view === "dashboard" && user && <Dashboard user={user} />}
      </main>

      <footer className="bg-white py-4 text-center text-gray-500 border-t absolute w-screen bottom-0">
        Task Tracker &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// Header Component
function Header({ user, handleLogout }) {
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

// Login Component
function Login({ setUser, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
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
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email,
        password,
      });
    } catch (error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    // Login successful
    const userForSession = { ...user };
    delete userForSession.password; // Don't store password in session
    // localStorage.setItem('taskTrackerUser', JSON.stringify(userForSession));
    setUser(userForSession);
    setView("dashboard");
    setLoading(false);
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
            onClick={() => setView("signup")}
            className="text-indigo-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

// Signup Component
function Signup({ setUser, setView }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call with delay
    setTimeout(() => {
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

      try {
         await axios.post(`${BACKEND_URL}/auth/signup`, {
          ...newUser,
        });
      } catch (error) {
        setError("Email already in use");
        setLoading(false);
        return;
      }
      // Log in the new user
      const userForSession = { ...newUser };
      await axios.post(`${BACKEND_URL}/auth/signin`,{
        email:newUser.email,
        password:newUser.password
      })
      // delete userForSession.password; // Don't store password in session
      // localStorage.setItem('taskTrackerUser', JSON.stringify(userForSession));

      setUser(userForSession);
      setView("dashboard");
      setLoading(false);
    }, 800);
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
            onClick={() => setView("login")}
            className="text-indigo-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user }) {
  const [projects, setProjects] = useState(user.projects || []);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Project form state
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("pending");

  // Save projects to localStorage whenever they change
  useEffect(() => {
    // Update projects in the user data
    const updatedUser = { ...user, projects };
    localStorage.setItem("taskTrackerUser", JSON.stringify(updatedUser));

    // Also update in the users collection
    const users = JSON.parse(localStorage.getItem("taskTrackerUsers") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, projects };
      }
      return u;
    });
    localStorage.setItem("taskTrackerUsers", JSON.stringify(updatedUsers));
  }, [projects, user]);

  const addProject = () => {
    if (projects.length >= 4) {
      alert("Maximum of 4 projects allowed!");
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDesc,
      tasks: [],
      creationDate: new Date().toISOString(),
    };

    setProjects([...projects, newProject]);
    setShowProjectForm(false);
    setActiveProject(newProject.id);
    setNewProjectName("");
    setNewProjectDesc("");
  };

  const deleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter(
        (project) => project.id !== projectId
      );
      setProjects(updatedProjects);
      if (activeProject === projectId) {
        setActiveProject(updatedProjects[0]?.id || null);
      }
    }
  };

  const addTask = (projectId) => {
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: newTaskStatus,
      creationDate: new Date().toISOString(),
    };

    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: [...(project.tasks || []), newTask],
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setShowTaskForm(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskStatus("pending");
  };

  const updateTaskStatus = (projectId, taskId, status) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedTask = { ...task, status };

              // If status is "completed", set completion date
              if (status === "completed" && !task.completionDate) {
                updatedTask.completionDate = new Date().toISOString();
              } else if (status !== "completed") {
                // If changing from completed to something else, remove completion date
                delete updatedTask.completionDate;
              }

              return updatedTask;
            }
            return task;
          }),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
  };

  const deleteTask = (projectId, taskId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
  };

  // Get the current active project object
  const currentProject = projects.find(
    (project) => project.id === activeProject
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Projects</h2>

        <button
          onClick={() => setShowProjectForm(!showProjectForm)}
          className={`px-4 py-2 rounded flex items-center ${
            projects.length >= 4
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          disabled={projects.length >= 4}
        >
          <Plus size={18} className="mr-1" />
          New Project {projects.length}/4
        </button>
      </div>

      {showProjectForm && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">Create New Project</h3>

          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows="3"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProjectForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">You don't have any projects yet.</p>
          {!showProjectForm && (
            <button
              onClick={() => setShowProjectForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Create Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-6">
          {/* Project Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="bg-gray-100 p-4 font-medium border-b">Projects</h3>
              <ul>
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className={`border-b last:border-b-0 ${
                      project.id === activeProject
                        ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => setActiveProject(project.id)}
                      className="p-3 text-left w-full hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs bg-gray-200 rounded-full px-2 py-1">
                        {(project.tasks || []).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Project Content */}
          <div className="md:col-span-4">
            {currentProject ? (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{currentProject.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {currentProject.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowTaskForm(!showTaskForm)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      New Task
                    </button>
                    <button
                      onClick={() => deleteProject(currentProject.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex items-center"
                    >
                      <Trash size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>

                {showTaskForm && (
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="text-lg font-medium mb-4">Add New Task</h3>

                    <div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Task Title
                        </label>
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          required
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          rows="2"
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={newTaskStatus}
                          onChange={(e) => setNewTaskStatus(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowTaskForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => addTask(currentProject.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Add Task
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  {(currentProject.tasks || []).length === 0 ? (
                    <div className="text-center p-6 text-gray-500">
                      <p>
                        No tasks yet. Create your first task to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Tasks list */}
                      {(currentProject.tasks || []).map((task) => (
                        <Task
                          key={task.id}
                          task={task}
                          projectId={currentProject.id}
                          updateTaskStatus={updateTaskStatus}
                          deleteTask={deleteTask}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">
                  Select a project from the sidebar or create a new one.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Task Component
function Task({ task, projectId, updateTaskStatus, deleteTask }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="p-3 flex items-center justify-between bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {task.status === "completed" ? (
            <span className="text-green-500 mr-2">
              <Check size={18} />
            </span>
          ) : (
            <span className="text-gray-400 mr-2">
              <Bell size={18} />
            </span>
          )}
          <span
            className={
              task.status === "completed" ? "line-through text-gray-500" : ""
            }
          >
            {task.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              statusColors[task.status]
            }`}
          >
            {statusLabels[task.status]}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 border-t">
          {task.description && (
            <p className="text-gray-700 mb-3">{task.description}</p>
          )}

          <div className="text-xs text-gray-500 mb-3">
            <div>Created: {formatDate(task.creationDate)}</div>
            {task.completionDate && (
              <div>Completed: {formatDate(task.completionDate)}</div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <select
                value={task.status}
                onChange={(e) =>
                  updateTaskStatus(projectId, task.id, e.target.value)
                }
                className="text-sm p-1 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              onClick={() => deleteTask(projectId, task.id)}
              className="text-sm text-red-600 hover:text-red-800 flex items-center"
            >
              <Trash size={14} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
