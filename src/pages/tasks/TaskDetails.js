import React, { useEffect, useState } from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'

export default function TaskDetails() {
    const { id } = useParams() 
    const task = useLoaderData()
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
      fetch(`http://localhost:4000/users`)
      .then(res => res.json())
      .then( users => setAllUsers(users))
    },[]);
    const getUsername = selectedUserId => {
      let matchingUser;
      if (Array.isArray(selectedUserId)) {
        matchingUser = allUsers.find((user) => selectedUserId.includes(user.id));
      } else {
        matchingUser = allUsers.find((user) => user.id === selectedUserId);
      }
      return matchingUser ? `${matchingUser.name} ${matchingUser.surname}` : 'Unknown User';
    };
  return (
    <div className='taskDetails'>
        <h2>Task title: {task.title} </h2>
        <p>Description: {task.description}</p>
        <p>Created by: {getUsername(task.createdBy)} </p>
        <p>Assigned for: {getUsername(task.selectedAssignment)}</p>
        <p>Due date: {task.dueDate}</p>
        <p>Progress: {task.progress ? 'Completed' : 'In Progress'}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  )
}
// Loader function
export const taskDetailLoader = async ({params}) => {
    const { id } = params;
    const res = await fetch('http://localhost:4000/tasks/' + id)
    if(!res.ok) {
        throw Error('Could not find this career')
    }
    return res.json()
}