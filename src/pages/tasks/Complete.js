import React, { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom';

export default function Complete() {
  const { allUsers, sortedCompletedTasks } = useOutletContext();
  const [tasks,setTasks] = useState(sortedCompletedTasks);
  return (
    <div className="task-container">
    <div className="task-task">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Link to={`/tasks/${task.id}`} key={task.id}>
            <div key={task.id} className="task-item">
              <h3 className="hoverEffect">{task.title}</h3>
              <p className="hoverEffect">
                Created by:
                {allUsers.find((user) => user.id === task.createdBy)?.name ?? "Unknown"}
                {String.fromCharCode(160)}
                {allUsers.find((user) => user.id === task.createdBy)?.surname ?? ""}
              </p>
              <div className="wrapButton hoverEffect">
                <p className="hoverEffect">
                  Due date was on: {task.dueDate}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="empty-task">
          <p>You have not completed any tasks yet. Your boss won't be happy.</p>
        </div>
      )}
    </div>
  </div>
);
}