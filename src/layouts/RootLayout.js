import React, { useState } from 'react'
import {  NavLink, Outlet, Navigate, Link, useLocation } from 'react-router-dom'

    export default function RootLayout() {
        const location = useLocation();
        const  user  = location.state;
        const [currentUser,setCurrentUser] = useState(user)
        if(!currentUser){
          return <Navigate to='/account/sign-in' replace={true}/>
        }
   return (
     <div className='root-layout'>
        <header>
            <nav className="navbar">
                <h1>TODOS</h1>
                <div className="links">
                    <NavLink to="">Home</NavLink>
                    <NavLink to="Tasks">Tasks</NavLink>
                    <NavLink to="create">Create</NavLink>
                    <Link onClick={()=> setCurrentUser(null)}>Logout</Link>
                </div>
            </nav>
        </header>
        <main>
            <Outlet context={currentUser}/>
        </main>
     </div>
   )
 }
 