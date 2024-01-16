import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useOutletContext, } from 'react-router-dom';

export default function Home() {
  const userContext = useOutletContext();
  const user = userContext.user;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [day,setDay] = useState(currentDate.getDate());
  const [dayOfWeek,setDayOfWeek] = useState(currentDate.toLocaleDateString('en-US', { weekday: 'long' }))
  const [createdTasks,setCreatedTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
      setDay(currentDate.getDate());
      setDayOfWeek(currentDate.toLocaleDateString('en-US', { weekday: 'long' }))
    }, 1000); // Update every second (for demonstration)
    return () => clearInterval(intervalId);
  }, [currentDate]);
  useEffect(() => {
    fetch(`http://localhost:4000/tasks/?createdBy=${user.id}`)
    .then(res => res.json())
    .then( tasks => setCreatedTasks(tasks))
    .catch(err => console.log(err.message))
  },[user.id])
  useEffect(() => {
    fetch(`http://localhost:4000/users`)
    .then(res => res.json())
    .then( users => setAllUsers(users))
  },[]);
  const getUsername = selectedUserId => {
    const matchingUser = allUsers.find((user) => selectedUserId.includes(user.id));
    return matchingUser ? `${matchingUser.name} ${matchingUser.surname}` : 'Unknown User';
  };
  const deleteTask = async (taskId) => {
    setIsDeleting(true); // Set state to indicate deletion in progress
    try {
      const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Deletion failed'); // Optionally throw an error for handling
      } else {
        const updatedTasks = createdTasks.filter((task) => task.id !== taskId);
        setCreatedTasks(updatedTasks);
        console.log('Task deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
    } finally {
      setIsDeleting(false); // Clear deletion state
    }
  };
  return (
    <div className='home'>
      <h2>Welcome {user.name} {user.surname}</h2>
      <p>Today is {dayOfWeek} {day}</p>
      <p className='mb-5'>View your tasks and get ahead of the curve! <Link className="links" to="/tasks">Todo-List</Link></p>

      <h2 className='mb-5'>Created Tasks:</h2>
      <div className='task-container'>
        <div className="task-task">
          {createdTasks.length > 0 ? (
            createdTasks.map((task) => (
              <Link to={`/${task.id}`} key={task.id}>
                <div key={task.id} className={`task-item`}>
                  <h3 className='hoverEffect'>{task.title}</h3>
                  <p className='hoverEffect'>Assigned for: {getUsername(task.selectedAssignment)}</p>
                  <div className="wrapButton hoverEffect">
                    <p className='hoverEffect'>Progress: {task.progress? 'Completed' : 'in progress'}</p>
                    <button onClick={(e) => { e.preventDefault();deleteTask(task.id)}} disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-created">
              <p>You have not created any tasks yet! To create new tasks go to: <Link className='linked' to='/create'>Create</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}