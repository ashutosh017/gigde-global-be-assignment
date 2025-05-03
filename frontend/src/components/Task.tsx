import { useState } from "react";
import * as types from "../types.ts";
import { Bell, Check, ChevronDown, ChevronUp, Trash } from "lucide-react";

export function Task({
  task,
  projectId,
  updateTaskStatus,
  deleteTask,
}: {
  task: types.Task;
  projectId: string;
  updateTaskStatus: (projectId: string, taskId: string, status: string) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}) {
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
  const formatDate = (dateString: string) => {
    // const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
    );
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
