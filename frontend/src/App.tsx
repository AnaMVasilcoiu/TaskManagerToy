import React, { useEffect, useState } from "react";
import "./App.css";

import { ReactComponent as TrashIcon } from './assets/trash.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

interface TaskHistory {
    id: number;
    task_id: number;
    title: string;
    description: string;
    status: string;
    action: string;
    timestamp: Date;
}

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "DONE"];
const STATUS_COLORS: Record<string, string> = {
    OPEN: "#f9d342",
    IN_PROGRESS: "#3498db",
    DONE: "#2ecc71",
};

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [filterTitle, setFilterTitle] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

    const [editTaskId, setEditTaskId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("OPEN");

    const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
    const [historyTaskId, setHistoryTaskId] = useState<number | null>(null);

    const fetchCompleteHistory = () => {
        fetch("/api/taskHistory")
            .then((res) => res.json())
            .then((data: TaskHistory[]) => {
                setTaskHistory(data);
            })
            .catch((err) => console.error("Error fetching history:", err));
    };

    useEffect(() => {
        fetchCompleteHistory();
    }, []);

    const fetchHistory = (taskId: number) => {
        fetch(`/api/tasks/${taskId}/history`)
            .then(res => res.json())
            .then((data: TaskHistory[]) => setTaskHistory(data))
            .catch(err => console.error("Error fetching history:", err));
    };

    const fetchTasks = () => {
        setLoading(true);
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data: Task[]) => {
                const sorted = data.sort((a, b) => a.status.localeCompare(b.status));
                setTasks(sorted);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching tasks:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = () => {
        if (!newTitle) return;
        fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, description: newDescription, status: "OPEN" }),
        })
            .then(() => {
                setNewTitle("");
                setNewDescription("");
                fetchTasks();
                fetchCompleteHistory();
            })
            .catch((err) => console.error("Error adding task:", err));
    };

    const deleteTask = (id: number) => {
        fetch(`/api/tasks/${id}`, { method: "DELETE" })
            .then(() => {
                setDeleteTaskId(null);
                fetchTasks();
                fetchCompleteHistory();
            })
            .catch((err) => console.error("Error deleting task:", err));
    };

    const editTask = (id: number, updatedTask: { title: string; description: string; status: string }) => {
        fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update task");
                return res.json();
            })
            .then((data: Task) => {
                // Update the task in state
                setTasks((prevTasks) =>
                    prevTasks.map((task) => (task.id === id ? data : task))
                );
                fetchCompleteHistory();
            })
            .catch((err) => console.error("Error updating task:", err));
    };

    const fetchFilteredTasks = () => {
        // Build query parameters
        const params = new URLSearchParams();
        if (filterTitle) params.append("title", filterTitle);
        if (filterStatus) params.append("status", filterStatus);

        fetch(`/api/tasks/filter?${params.toString()}`)
            .then((res) => res.json())
            .then((data: Task[]) => {
                setTasks(data);
            })
            .catch((err) => {
                console.error("Error fetching tasks:", err);
            });
    }

    useEffect(() => {
        fetchFilteredTasks();
    }, [filterTitle, filterStatus]);

    if (loading) return <div className="loading">Loading tasks...</div>;

    return (
        <div className="app-container">
            <h1>Task Manager</h1>

            {/* Add new task */}
            <div className="add-task">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            {/* Filter tasks */}
            <div className="filter-tasks">
                <input
                    type="text"
                    placeholder="Filter by title..."
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All statuses</option>
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {tasks.length === 0 ? (
                <p className="no-tasks">No tasks found.</p>
            ) : (
                <div className="task-list">
                    {tasks.map((task) => (
                        <div className="task-card" key={task.id}>
                            <div className="task-header">
                                <strong>{task.title}</strong>
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor: STATUS_COLORS[task.status] }}
                                >
                                  {task.status}
                                </span>
                            </div>
                            <p>{task.description}</p>
                            <div className="task-buttons">
                                <button onClick={() => setDeleteTaskId(task.id)} className="delete-btn" title="Delete">
                                    {/*<TrashIcon />*/} Delete
                                </button>
                                <button
                                    onClick={() => {
                                        const taskToEdit = tasks.find(t => t.id === task.id);
                                        if (taskToEdit) {
                                            setEditTaskId(taskToEdit.id);
                                            setEditTitle(taskToEdit.title);
                                            setEditDescription(taskToEdit.description);
                                            setEditStatus(taskToEdit.status);
                                        }
                                    }}
                                    className="edit-btn"
                                    title="Edit"
                                >
                                    {/*<EditIcon/>*/} Edit
                                </button>
                                <button onClick={() => { setHistoryTaskId(task.id); fetchHistory(task.id); }} className="history-btn">
                                    History
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="history-log">
                <h2>Task History</h2>
                {loading ? (
                    <p>Loading history...</p>
                ) : taskHistory.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <table className="history-table">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {taskHistory.map((h) => (
                            <tr key={h.id}>
                                <td>{h.title}</td>
                                <td>{h.description}</td>
                                <td>{h.status}</td>
                                <td>{h.action}</td>
                                <td>{new Date(h.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Confirmation Dialog */}
            {deleteTaskId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to delete this task?</p>
                        <div className="modal-actions">
                            <button onClick={() => deleteTask(deleteTaskId)}>Yes</button>
                            <button onClick={() => setDeleteTaskId(null)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit dialog */}
            {editTaskId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit Task</h3>
                        <div className="form-input">
                            <h5>Title:</h5>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Title"
                            />
                        </div>

                        <div className="form-input">
                            <h5>Description:</h5>
                            <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description"
                            />
                        </div>

                        <div className="form-input">
                            <h5>Status:</h5>
                            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    if (editTaskId !== null) {
                                        editTask(editTaskId, {
                                            title: editTitle,
                                            description: editDescription,
                                            status: editStatus,
                                        });
                                        setEditTaskId(null);
                                    }
                                }}
                            >
                                Save
                            </button>
                            <button onClick={() => setEditTaskId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* History dialog */}
            {historyTaskId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Task History</h3>
                        <ul>
                            {taskHistory.map((h) => (
                                <li key={h.id}>
                                    <strong>{h.action}</strong> - {h.status} - {h.title} - {h.description}
                                    <em>({new Date(h.timestamp).toLocaleString()})</em>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setHistoryTaskId(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
