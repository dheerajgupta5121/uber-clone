import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Start from './Pages/Start';
import Home from './Pages/Home';
import UserSignup from './Pages/UserSignup';
import UserLogin from './Pages/UserLogin';
import CaptainLogin from './Pages/CaptainLogin';
import CaptainSignup from './Pages/CaptainSignup';
import './App.css';
import UserProtectedWrapper from './Pages/UserProtectedWrapper';
import UserLogout from './Pages/UserLogout';

const App = () => {
  return (
    <div >
      <Routes>
        <Route path={'/'} element={<Start/>} />
        <Route path={'/login'} element={<UserLogin/>} />
        <Route path={'/signUp'} element={<UserSignup/>} />
        <Route path={'/captain-login'} element={<CaptainLogin/>} />
        <Route path={'/captain-signup'} element={<CaptainSignup/>} />
        <Route path={'/home'} element={
          <UserProtectedWrapper>
            <Home/>
          </UserProtectedWrapper>} 
        /> 
        <Route path='/user/logout'
          element={<UserProtectedWrapper>
            <UserLogout />
          </UserProtectedWrapper>
          } 
        />
      
      </Routes>
    </div>
  )
}

export default App
