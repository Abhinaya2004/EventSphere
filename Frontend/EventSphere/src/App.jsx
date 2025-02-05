import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div>
      <Navbar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App