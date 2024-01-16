import React, { useEffect, useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Signin() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [matchedUser,setMatchedUser] = useState(null);

    const [isPending,setIsPending] = useState();
    const [userExist, setUserExist] = useState(true);
    const [passwordCorrect, setPasswordCorrect] = useState(true)  
    
    useEffect(() => {
      if (matchedUser !== null) {
        if (!matchedUser) {
          setPasswordCorrect(false);
          setIsPending(false);
        } else {
          setPasswordCorrect(true);
          setIsPending(false);
          navigate('/', { state: { user: matchedUser } });
        }}
    }, [matchedUser, navigate]); // Empty dependency array
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsPending(true)
            fetch('http://localhost:4000/users', {
              method: 'Get',
              headers: { "Content-Type": "application/json" }
            })
              .then(res => res.json())
              .then(users => {
                const matches = users.filter(user => user.email === email);
                if (matches.length === 0) {
                  setUserExist(false);
                  setIsPending(false);
                  return
                } else {
                    setUserExist(true);
                    const potentialMatchedUser = matches.find(user => user.password === password);
                    setMatchedUser(potentialMatchedUser);
              }
                }
              )
              .catch(err => {
                console.log(err.message());
                alert('An error occurred, please try again later');
              }).finally(() => {
                setIsPending(false)})
            };
  return (
    <div className="switch">       
        <div className="outlet">
            <div className='sign-in'>
                <Form method="post">
                    <div className="show-Error">
                      <div className='no-border'>
                          <input type="email" name="email" placeholder='Email: example@gmail.com' required
                          onChange={e => setEmail(e.target.value)}
                          />
                      </div>
                      <span className="error" style={{ height: 20, width: 100, backgroundColor: 'burlywood' }}>
                        {!userExist ? "User doesn't exist" : String.fromCharCode(160)}
                      </span>
                    </div>
                    <div className="show-Error">  
                      <div className='no-border'>
                          <input name="password" type={visible ? 'text' : 'password'} placeholder="Password" required 
                          onChange={e => {setPassword(e.target.value)}}
                          />
                          {visible ? <FontAwesomeIcon icon={faEye} onClick={() => setVisible(false)} /> 
                          : <FontAwesomeIcon icon={faEyeSlash} onClick={() => setVisible(true)} />}                    
                      </div>
                      <span className="error" style={{ height: 20, width: 100, backgroundColor: 'burlywood' }}>
                        {userExist && !passwordCorrect ? "Wrong password" : String.fromCharCode(160)}
                      </span>
                    </div>
                    <div className="button">
                      <button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? ( <FontAwesomeIcon icon={faSpinner} spin />) : ('Sign in')}
                      </button>
                    </div>
                    <div className='forget-pass'>
                        <Link>Forgot password?</Link>
                    </div>
                    <div className='reg'>
                    <Link to="/account/reg">Create a new account</Link>
                    </div>
                </Form>
            </div>
        </div>
    </div>
  )
}
