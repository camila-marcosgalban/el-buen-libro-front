import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api'

export default function Home(){
  const [title, setTitle] = React.useState('Pedido')
  const [ownerName, setOwnerName] = React.useState('')
  const [joinCode, setJoinCode] = React.useState('')
  const nav = useNavigate()

  useEffect(()=>{
    // ensure theme attribute exists for first load
    const t = localStorage.getItem('ebl-theme') || 'crt'
    document.documentElement.setAttribute('data-theme', t)
  },[])

  return (
    <div className="screen">
      <h1 className="title">📖 El Buen Libro</h1>
      <p className="sub">Pedidos - Business Analyst Team</p>
      <div className="pixel-card grid gap-6">
        <div>
          <h3 className="title-sm">Crear pedido</h3>
          <input className="inp" placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="inp" placeholder="Tu nombre" value={ownerName} onChange={e=>setOwnerName(e.target.value)} />
          <button className="arcade-btn" onClick={async ()=>{
            const o = await createOrder({ title, ownerName })
            nav(`/o/${o.code}`)
          }}>Crear</button>
        </div>
        <div className="divider" />
        <div>
          <h3 className="title-sm">Unirse a un pedido</h3>
          <input className="inp" placeholder="Código (ABC-123)" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} />
          <button className="arcade-btn alt" onClick={()=> nav(`/o/${joinCode}`)}>Unirme</button>
        </div>
      </div>
    </div>
  )
}
