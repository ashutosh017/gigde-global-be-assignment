import axios from "axios";
import { useEffect, useState } from "react";
import { redirect } from "react-router";
import { BACKEND_URL } from "../config";
import { Task } from "./Task";
import { Plus, Trash } from "lucide-react";
import { Project} from "../types";

export function Dashboard() {
  const [projects, setProjects] = useState<Project[] >([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [token, setToken] = useState<string | null >(null)
  // const [user, setUser] = useState(null);

  // Project form state
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("pending");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    (async () => {
     try {
      const res = await axios.get(`${BACKEND_URL}/projects`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // if (res.status === 401 || res.status === 403) {
        // handleLogout();
      // }
      setProjects(res.data)
     } catch (error) {
      redirect("/login");
      
     }
    })();
  }, []);

  // Save projects to localStorage whenever they change
  // useEffect(() => {
  //   // Update projects in the user data
  //   const updatedUser = { ...user, projects };
  //   // localStorage.setItem("taskTrackerUser", JSON.stringify(updatedUser));

  //   // Also update in the users collection
  //   const users = JSON.parse(localStorage.getItem("taskTrackerUsers") || "[]");
  //   const updatedUsers = users.map((u) => {
  //     if (u.id === user.id) {
  //       return { ...u, projects };
  //     }
  //     return u;
  //   });
  //   localStorage.setItem("taskTrackerUsers", JSON.stringify(updatedUsers));
  // }, [projects, user]);

  const addProject = async() => {
    if (projects.length >= 4) {
      alert("Maximum of 4 projects allowed!");
      return;
    }

    const newProject = {
      name: newProjectName,
      description: newProjectDesc,
      tasks: [],
      creationDate: new Date().toISOString(),
    };
    try {
      await axios.post(`${BACKEND_URL}/projects`,{
        ...newProject
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
    } catch (error) {
      console.log("error: ",error)
    }
    setProjects([...projects, newProject]);
    setShowProjectForm(false);
    setActiveProject(newProject.id);
    setNewProjectName("");
    setNewProjectDesc("");
  };

  const deleteProject = async(projectId:string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter(
        (project) => project.id !== projectId
      );
      await axios.delete(`${BACKEND_URL}/projects/${projectId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }).catch((err)=>{
        console.log(err)
      })
      setProjects(updatedProjects);
      if (activeProject === projectId) {
        setActiveProject(updatedProjects[0]?.id || null);
      }
    }
  };

  const addTask = async(projectId:string) => {
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: newTaskStatus,
      creationDate: new Date().toISOString(),
    };

    const updatedProjects = projects.map((project:Project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: [...(project.tasks || []), newTask],
        };
      }
      return project;
    });
    await axios.post(`${BACKEND_URL}/tasks/${projectId}`,{
      ...newTask
    },{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).catch((error)=>{
      console.log(error)
    })

    setProjects(updatedProjects);
    setShowTaskForm(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskStatus("pending");
  };

  const updateTaskStatus = async(projectId:string, taskId:string, status:string) => {
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
              } else if (status !== "completed" ) {
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

    await axios.post(`${BACKEND_URL}/tasks/${taskId}`,{
      status
    },{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).catch((error)=>{
      console.log(error)
    })
  };

  const deleteTask = async(projectId:string, taskId:string) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId),
        };
      }
      return project;
    });
    await axios.delete(`${BACKEND_URL}/tasks/${taskId}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).catch((error)=>{
      console.log(error)
    })
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
                rows={3}
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
                          rows={2}
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
