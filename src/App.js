import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styling
import { FaTrashAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://redaybe.local/api/redayit_dev_todos');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Create a new task
  const createTask = async () => {
    try {
      await axios.post('http://redaybe.local/api/redayit_dev_todos', newTask);
      fetchTasks(); // Refresh tasks list
      setNewTask({ title: '', description: '' }); // Clear input fields
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Update the new task state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://redaybe.local/api/redayit_dev_todos/${id}`);
      fetchTasks(); // Refresh tasks list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle task completion status
  const toggleCompletion = async (id, completed) => {
    try {
      await axios.put(`http://redaybe.local/api/redayit_dev_todos/${id}`, { completed: !completed });
      fetchTasks(); // Refresh tasks list
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Update task completion status via dropdown
  const handleCompletionChange = async (id, event) => {
    const newStatus = event.target.value === 'completed';
    try {
      await axios.put(`http://redaybe.local/api/redayit_dev_todos/${id}`, { completed: newStatus });
      fetchTasks(); // Refresh tasks list
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Redayit To-Do App</h1>

      <div className="task-creation">
        <h3>Create Task</h3>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Task Title"
        />
        <input
          type="text"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Task Description"
        />
        <button className="btn-create" onClick={createTask}>Create Task</button>
      </div>

      <div className="task-list">
        <h3>Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-content">
                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                <div className="task-description">
                  {task.description}
                </div>
              </div>

              <div className="task-actions">
                <select 
                  className="status-dropdown" 
                  value={task.completed ? 'completed' : 'pending'}
                  onChange={(e) => handleCompletionChange(task._id, e)}
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="completed">Mark as Completed</option>
                </select>
                <button className="btn-delete" onClick={() => deleteTask(task._id)}>
                  <FaTrashAlt />
                </button>
                <button 
                  className={`btn-complete ${task.completed ? 'completed' : ''}`} 
                  onClick={() => toggleCompletion(task._id, task.completed)}
                >
                  {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
