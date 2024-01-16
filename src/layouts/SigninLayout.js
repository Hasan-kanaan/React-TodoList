import React from 'react'
import { Outlet } from 'react-router-dom'

export default function SigninLayout() {
  return (
    <div className="sign-container">
        <div className="text-container">
            <h2>Todo</h2>
            <p>Todo helps you organise and manage your tasks alone or with your team.</p>
        </div>
          <Outlet />
    </div>
  )
}
