import React, { Fragment, useEffect, useState } from 'react'
import { Form, useOutletContext } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function CreateTodo() {
  const userContext = useOutletContext();
  const currentUser  = userContext.user;
  const navigate = useNavigate();

  const [isPending,setIsPending] = useState(false);
  
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [selectedPrio, setSelectedPrio] = useState('high');
  const [selectedAssignment, setSelectedAssignment] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [sortedByName,setSortedByName] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/users`)
    .then(response =>  response.json())
    .then(fetchedUsers => {
      const filteredUsers = fetchedUsers.filter(user => user.email !== currentUser.email);
      setUsers(filteredUsers);
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
  }, [currentUser.email]);
  useEffect(() => {
    const sortUsers = (users) => {
      return users.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
    };
    const sortedUsers = sortUsers(users);
    setSortedByName(sortedUsers);
  }, [users]);
  const options = [
    { value: currentUser.id, label: 'Myself' }, // Option for the current user
    ...sortedByName.map(user => ({
      value: user.id,
      label: `${user.name} ${user.surname}, ${user.position}` // Options for other users
    }))
  ];
  const styles = {
    control: (styles,state) => ({...styles,
    boxShadow: state.isFocused ? '0 0 0 1px #2b3452 !important' : '0 0 0 0 #2b3452 !important',
    backgroundColor: "antiquewhite", width: '250px',
    border:'1px solid #2b3452', outline: 'none',
    '&:active': { border: '1px solid burlywood', outline: 'none'},
    '&:hover': {border: "1px solid burlywood",
    },
  }),
    option: (styles, {isFocused, isSelected}) => ({...styles,
      '&:hover': {backgroundColor:'burlywood'},
      '&.css-1n6sfyn-MenuList > div': { // Target all direct child divs
        backgroundColor: 'burlywood',
      },
      }),
  }

  const handleSubmit = () => {
    setIsPending(true);
    const createdBy = currentUser.id;
    const formattedDate = dueDate.toLocaleDateString('en-US'); // "2024-01-19"
    const progress = false;
    const tasks = selectedAssignment.map((assignedId) => ({
      title,
      description,
      createdBy,
      selectedAssignment: [assignedId], // Assign a single ID for each task
      selectedPrio,
      dueDate: formattedDate,
      progress,
    }));
    Promise.all(
      tasks.map((task) =>
        fetch(`http://localhost:4000/tasks`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        })
      ))
      .then((responses) => Promise.all(responses.map((response) => response.json())))
      .catch(err=> err.message())
      .finally(() => {
        setIsPending(false)
          const toastId = toast.success("Task created successfully!", {
            position: "top-center",
            autoClose: 3500,
          });
    
          toast.update(toastId, {
            render: () => (
              <Fragment>
                <p>Task created successfully!</p>
                <button className='toast-button' onClick={() => navigate("/")}>View task in Home</button>
              </Fragment>
            ),
          });
        });
    }
  return (
    <div className='create-todo'>
      <div className="create-textContainer">
        <p>Create a task with ease!</p>
      </div>
      <div className="create-container">
        <ToastContainer />
        <div className="create-formContainer">
          <Form>
            <div className='create-inputWrap'>
              <label htmlFor='title'>Title: </label>
              <input type="text" name='title' id='title'
              placeholder='eg: Go to work' required
              onChange={e => setTitle(e.target.value)}/>
            </div>
            <div className='create-inputWrap'>
              <label htmlFor='description'>Description: </label>
              <textarea name="description" id="description" 
              cols="10" rows="10" required
              placeholder='eg:
                1-get in car
                2-drive to work
                3-park and head to office'
                onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <div className="create-radioContainer">
            <label >Prioriry: </label>
              <div className='create-radio'>
                <input type='radio' name='prio' 
                value='high' id='high' className='custom-radio'
                checked={selectedPrio === 'high'}
                onChange={() => setSelectedPrio('high')} />
              <label htmlFor="high">High</label>
              </div>
              <div className='create-radio'>
                <input type='radio' name='prio' 
                value='medium' id='medium' className='custom-radio'
                onChange={() => setSelectedPrio('medium')} />
              <label htmlFor="medium">Medium</label>
              </div>
              <div className='create-radio'>
                <input type='radio' name='prio' 
                value='low' id='low' className='custom-radio'
                onChange={() => setSelectedPrio('low')} />
              <label htmlFor="low">Low</label>
              </div>
            </div>
            <div className="assign">
              <label>Assign for: </label>
              <Select
                className='my-select'
                placeholder="Select an employee"
                isMulti
                styles={styles}
                options={options}
                onChange={(selectedOption) =>{ 
                  if (Array.isArray(selectedOption)) {
                    const uniqueValues = [...new Set([
                      ...selectedAssignment,
                      ...selectedOption.map((option) => option.value),
                    ])];
                    setSelectedAssignment(uniqueValues);
                  } else {
                    // Check if already selected
                    if (!selectedAssignment.includes(selectedOption.value)) {
                      setSelectedAssignment([selectedOption.value]);
                    }
                  }
                }}
              />
            </div>
            <div className="datePicker">
            <label htmlFor='dueDate'>Due Date:</label>
            <DatePicker
              name='dueDate'
              id='dueDate'
              autoComplete="off"
              selected={dueDate}
              onChange={(date) =>{
                setDueDate(date)}}
              placeholderText="Select Due Date"
            />
            </div>
            <div className="submition">
              <button onClick={handleSubmit}
              disabled={isPending}>
              {isPending ? ( <FontAwesomeIcon icon={faSpinner} spin />) : ('Create')}</button>
            </div>
          </Form>
        </div>
      </div>
    </div>                 
  )
}