import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import OrderRoom from './pages/OrderRoom.jsx'
import NewSandwich from './pages/NewSandwich.jsx'
import EditSandwich from './pages/EditSandwich.jsx'
import AdminOptions from './pages/AdminOptions.jsx'
import './styles.css'

function useTheme(){
  const [theme,setTheme] = useState(()=> localStorage.getItem('ebl-theme') || 'crt')
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ebl-theme', theme)
  },[theme])
  return [theme,setTheme]
}

function TopBar(){
  const [theme,setTheme] = useTheme()
  const nav = useNavigate()
  return (
    <div className="topbar">
      <button className={`arcade-btn ${theme==='crt'?'active':''}`} onClick={()=>setTheme('crt')}>CRT</button>
      <button className={`arcade-btn alt ${theme==='gameboy'?'active':''}`} onClick={()=>setTheme('gameboy')}>Game Boy</button>
      <button className="arcade-btn" onClick={()=> nav('/')}>🏠 Home</button>
    </div>
  )
}

function App(){
  // ensure a theme is set at startup
  const [theme] = useTheme()
  return (
    <BrowserRouter>
      <TopBar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/o/:code' element={<OrderRoom/>} />
        <Route path='/o/:code/new' element={<NewSandwich/>} />
        <Route path='/o/:code/edit/:id' element={<EditSandwich/>} />
        <Route path='/admin/options' element={<AdminOptions/>} />
        <Route path='*' element={<div className="screen">404</div>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
