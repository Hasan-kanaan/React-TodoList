import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function TaskLayout() {
  const userContext = useOutletContext();
  const currentUser  = userContext.user;
  
  const [tasks,setTasks] = useState([])
  const [teamTasks, setTeamTasks] = useState([]);
  const [teamTasksPlusDue, setTeamTasksPlusDue] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [inProgressTasksPlusDue, setInProgressTasksPlusDue] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [sortedCompletedTasks, setSortedCompletedTasks] = useState([]);
  const [allUsers,setAllUsers] = useState([]);
  const [shouldFetchTasks, setShouldFetchTasks] = useState(false);
  
  const fetchTasks = () => {
    setShouldFetchTasks(true);
  };
  useEffect(()=>{
    fetch('http://localhost:4000/users', {
          method: 'Get',
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(user => {setAllUsers(user)})
  },[]);
  useEffect(() => {
    fetch('http://localhost:4000/Tasks')
      .then(res => res.json())
      .then(tasks => setTasks(tasks))
      .catch(error => console.error('Error fetching tasks:', error)) // Add error handling
      .finally(() => setShouldFetchTasks(false)); // Reset the flag
  }, [shouldFetchTasks]);
  useEffect(() => {
    if (tasks.length > 0) {
      const [inProgressTasks, completedTasks] = tasks.reduce((acc, task) => {
        acc[!task.progress ? 0 : 1].push(task);
        return acc;
      }, [[], []]);
      const filteredTasks = inProgressTasks.filter((task) =>
        task.selectedAssignment.includes(currentUser.id) &&
        task.createdBy === currentUser.id
      );
      const teamTasks = inProgressTasks.filter((task) =>
        task.selectedAssignment.includes(currentUser.id) &&
        task.createdBy !== currentUser.id
      );
      const filteredCompletedTasks = completedTasks.filter((task) =>
        task.selectedAssignment.includes(currentUser.id)
      );
      setInProgressTasks(filteredTasks);
      setTeamTasks(teamTasks);
      setCompletedTasks(filteredCompletedTasks);
    }
  }, [tasks, currentUser]);
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const sortTasks = (tasks) =>
      tasks.sort((a, b) => {
        const aDueDate = new Date(a.dueDate);
        const bDueDate = new Date(b.dueDate);
        if (aDueDate.getTime() === bDueDate.getTime()) {
          return a.missedDue ? -1 : 1;
        }
        return aDueDate < bDueDate ? -1 : 1; 
      });
    const addMissedDueFlag = (tasks) =>
      tasks.map((task) => ({
        ...task,
        missedDue: new Date(task.dueDate) < new Date(today),
      }));
    const sortedInProgressTasks = sortTasks(inProgressTasks);
    const sortedTeamTasks = sortTasks(teamTasks);
    const inProgressTasksWithMissedDue = addMissedDueFlag(sortedInProgressTasks);
    const inProgressTeamTasksWithMissedDue = addMissedDueFlag(sortedTeamTasks);
    setInProgressTasksPlusDue(inProgressTasksWithMissedDue);
    setTeamTasksPlusDue(inProgressTeamTasksWithMissedDue);
    const sortedCompletedTasks = sortTasks(completedTasks);
    setSortedCompletedTasks(sortedCompletedTasks);
  }, [inProgressTasks, teamTasks, completedTasks]);
  return (
    <div className="home-layout">
        <h2>View your Tasks</h2>
        <p>Got some tasks to do on your plate! What would you like to tackle first? </p>
        <nav>
          <NavLink to="Self">
            Self Assigned Tasks  
            <FontAwesomeIcon icon={faChevronDown} alt="Arrow pointing downward" className='icon'/>
            </NavLink>
          <NavLink to="Team">
            Team Assigned Tasks 
            <FontAwesomeIcon icon={faChevronDown} alt="Arrow pointing downward" className='icon' />
          </NavLink>
          <NavLink to="complete">
            All Completed Tasks 
            <FontAwesomeIcon icon={faChevronDown} alt="Arrow pointing downward" className='icon' />
          </NavLink>
        </nav>
        <div className="task-container">
          <Outlet context={{currentUser, inProgressTasksPlusDue, sortedCompletedTasks, teamTasksPlusDue, allUsers, fetchTasks}}/>
        </div>
    </div>
  )
}
