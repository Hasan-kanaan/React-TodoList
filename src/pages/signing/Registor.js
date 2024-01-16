import React, { useEffect, useState } from 'react'
import { Form, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Registor() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [position, setPosition] = useState([]);

  const [showError, setShowError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [isPending,setIsPending] = useState();
  const [emailExist, setEmailExist] = useState(false);
  const [availablePositions, setAvailablePositions] = useState([]);

  useEffect(()=>{
    fetch((`http://localhost:4000/positions`))
    .then(response =>  response.json())
    .then( positions =>    setAvailablePositions(positions))
    .catch(err => console.log(err.message()))
  },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsPending(true);
    if(password.length < 8){
      setShowError(true);
      setIsPending(false);
      return;
    }
    if (!selectedDay || !selectedMonth) {
      setShowDateError(true);
      setIsPending(false);
      return;
    }
    fetch(`http://localhost:4000/users`)
    .then(response =>  response.json())
    .then((users) => {
      const found = users.find((user) => user.email === email);
      if (found) {
        setIsPending(false);
        setEmailExist(true);
        return;
      } else {
        const userReg ={name, surname, email, password, selectedDay, selectedMonth, position};
        fetch('http://localhost:4000/users',{
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userReg)
        }).then(res=>{
          if (!res.ok) {
            console.log(res.message())
            setIsPending(false);
          }
          navigate('/');
        }).catch(err => {
          console.log(err.message())
          setIsPending(false);
        })
        }
      }).catch((error) => {
        setIsPending(false);
        console.error('Error checking email existence:', error);
    });
  } 

  const days = Array.from({ length: 31 }, (_, index) => ({
    value: index + 1,
    label: index + 1, // Use the same value for label in this case
  }));
  const months = [
    {value: 'Jan', label:'Jan'},
    {value: 'Feb', label:'Feb'},
    {value: 'Mar', label:'Mar'},
    {value: 'Apr', label:'Apr'},
    {value: 'May', label:'May'},
    {value: 'Jun', label:'Jun'},
    {value: 'Jul', label:'Jul'},
    {value: 'Aug', label:'Aug'},
    {value: 'Sep', label:'Sep'},
    {value: 'Oct', label:'Oct'},
    {value: 'Nov', label:'Nov'},
    {value: 'Dec', label:'Dec'},
  ]
  return (
    <div className="switch">
      <div className="outlet">
        <div className='registor'>
            <Form method="post">
              <div className="names">
                <input type="text" name="firstName" placeholder='First name' required 
                onChange={e => setName(e.target.value)} />
                <input type="text" name="Surname" placeholder='Surname' required 
                onChange={e => setSurname(e.target.value)} />
              </div>
              <div className='data'>
                <input type="email" name="email" placeholder='Email address' required 
                onChange={e => setEmail(e.target.value)} 
                onFocus={() => setEmailExist(false)}/>
              </div>
                <span className="error" style={{ height: 20, width: 150, 
                  backgroundColor: 'burlywood', display: 'block', marginBottom: 5}}>
                    {emailExist ? "Email already exists!" : String.fromCharCode(160)}
                </span>
              <div className='data'>
                <div className="combine">
                  <input name="password" type={visible ? 'text' : 'password'} 
                  placeholder="Password min:8-characters" required minLength="8"
                  onChange={e => setPassword(e.target.value)} 
                  onFocus={() => setShowError(false)} />
                  {visible ? <FontAwesomeIcon icon={faEye} onClick={() => setVisible(false)} /> 
                  : <FontAwesomeIcon icon={faEyeSlash} onClick={() => setVisible(true)} />}
                </div>
              </div>
              <span className="error" style={{ height: 20, width: 150, 
                backgroundColor: 'burlywood', display: 'block', marginBottom: 5}}>
                  {showError ? "Password too short!" : String.fromCharCode(160)}
                </span>
              <div className="dateOfBirth">
                <span>Date of birth: </span>
                <select id="day" value={selectedDay}
                        onChange={(e) => {
                          setSelectedDay(e.target.value);
                          setShowDateError(false)}} required>
                  <option disabled value="">Day</option> {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <select id="month" value={selectedMonth} onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setShowDateError(false);}} required>
                  <option disabled value="">Month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <span className="error" style={{ height: 20, width: 150, 
                backgroundColor: 'burlywood', display: 'block', marginBottom: 5}}>
                {showDateError ? "Please select a date!" : String.fromCharCode(160)}
              </span>
              <div className="position">
                <label htmlFor="position">Position:</label>
                <select name="posiotion" id="position"
                  onChange={e => setPosition(e.target.value)} required>
                  {availablePositions.map((position) => (
                    <option key={availablePositions.id} value={position.title}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleSubmit} disabled={isPending}>
                {isPending ? ( <FontAwesomeIcon icon={faSpinner} spin />) : ('Sign Up')}
              </button>
              <div className="back">
                <Link to="/account/sign-up">Already have an account?</Link>
              </div>
            </Form>
        </div>
      </div>
    </div>
  )
}
