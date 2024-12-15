import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import { Auth, Chat, Profile } from './pages'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/signup-login'/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/signup-login' element={<Auth/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
