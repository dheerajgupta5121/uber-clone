import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import Start from './Pages/Start'
import Home from './Pages/Home'
import UserSignup from './Pages/UserSignup'
import UserLogin from './Pages/UserLogin'
import CaptainLogin from './Pages/CaptainLogin'
import CaptainSignup from './Pages/CaptainSignup'
import CaptainHome from './Pages/CaptainHome'
import Riding from './Pages/Riding'
import CaptainRiding from './Pages/CaptainRiding'

// Protected Routes
import UserProtectedWrapper from './Pages/UserProtectedWrapper'
import CaptainProtectedWrapper from './Pages/CaptainProtectedWrapper'

// Logout
import UserLogout from './Pages/UserLogout'
import CaptainLogout from './Pages/CaptainLogout'

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signUp" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />

        {/* User Protected Routes */}
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />

        {/* Captain Protected Routes */}
        <Route
          path="/captain-home"
          element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          }
        />
        <Route
          path="/captain/logout"
          element={
            <CaptainProtectedWrapper>
              <CaptainLogout />
            </CaptainProtectedWrapper>
          }
        />

        {/* Shared Riding Routes */}
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />
      </Routes>
    </>
  )
}

export default App
