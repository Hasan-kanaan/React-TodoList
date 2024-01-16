  import React, { useState } from 'react'
  import { Link, useOutletContext } from 'react-router-dom';

  export default function Self() {
    const { inProgressTasksPlusDue, allUsers, fetchTasks } = useOutletContext();
    const [tasks, setTasks] = useState(inProgressTasksPlusDue);

    const updateTask = task => {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
      fetch(`http://localhost:4000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, progress: true }),
      })
        .then((res) => res.json())
        .catch((err) => console.error('Error updating task:', err))
        .finally(() => fetchTasks())
    };
    return (
      <div className='task-container'>
        <div className="task-task">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Link to={`/tasks/${task.id}`} key={task.id}>
                <div key={task.id} className={`task-item ${task.missedDue ? 'missed-due-task' : ''}`}>
                  <h3 className='hoverEffect'>{task.title}</h3>
                  <p className='hoverEffect'>Created by: 
                    {allUsers.find((user) => user.id === task.createdBy)?.name ?? "Unknown"}{String.fromCharCode(160)}
                    {allUsers.find((user) => user.id === task.createdBy)?.surname ?? ""}
                  </p>
                <div className="wrapButton hoverEffect">
                  <p className='hoverEffect'>
                    Due date: {task.dueDate}
                    {task.missedDue && <span className="missed-due hoverEffect"> {String.fromCharCode(160)} (Missed deadline)</span>}
                  </p>
                  <button onClick={(event)=> {event.preventDefault();updateTask(task)}}>Done</button>
                </div>
              </div>
            </Link>
          ))
          ) : (
            <div className="empty-task">
              <p>You have zero tasks in progress! Good work!</p>
            </div>
          )}
        </div>
      </div>
    )
}
