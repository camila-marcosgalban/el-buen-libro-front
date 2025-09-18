import React, { useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrderStore } from '../store'
import { patchOrder, deleteSandwich, duplicateSandwich } from '../api'
import SharePanel from '../shared/SharePanel'

export default function OrderRoom(){
  const { code } = useParams()
  const { connect, order, sandwiches } = useOrderStore()
  const nav = useNavigate()

  useEffect(()=>{ connect(code) }, [code])

  const perPerson = useMemo(()=>{
    const map = {}
    for (const s of sandwiches){
      const name = s.ownerName || '—'
      const amt = s.price || 0
      if(!map[name]) map[name] = 0
      map[name] += amt
    }
    return Object.entries(map).sort((a,b)=> a[0].localeCompare(b[0]))
  }, [sandwiches])

  if(!order) return <div className="screen">Cargando...</div>

  return (
    <div className="screen">
      <h1 className="title">{order.title} — <small>{order.code}</small></h1>
      <p className="sub">Estado: {order.status} | Items: {order.totals?.items || 0}</p>

      <div className="pixel-card" style={{marginBottom: 16}}>
        <div className="flex gap-3" style={{flexWrap:'wrap'}}>
          <Link className="arcade-btn" to={`/o/${code}/new`}>+ Agregar sándwich</Link>
          <button className="arcade-btn alt" onClick={()=> patchOrder(code, { status: 'locked' })}>🔒 Cerrar pedido</button>
        </div>
      </div>

      <div className="pixel-card" style={{marginBottom: 16}}>
        {sandwiches.map(s=> (
          <div key={s._id} className="preview-item" style={{gridTemplateColumns:'repeat(7, minmax(0,1fr))'}}>
            <span>👤 Para: {s.ownerName}</span>
            <span>🥖 {s.bread.label}</span>
            <span>🍗 {s.protein.label}</span>
            <span>➕ {s.toppings.map(t=>t.label).join(', ') || '—'}</span>
            <span>✍️ {s.notes || '—'}</span>
            <span>{s.price != null ? `💸 $${s.price}` : '💸 —'}</span>
            <span style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <Link className="arcade-btn" to={`/o/${code}/edit/${s._id}`}>Editar</Link>
              <button className="arcade-btn" onClick={()=> nav(`/o/${code}/new?copy=${s._id}`)}>Copiar y editar</button>
              <button className="arcade-btn" onClick={()=> duplicateSandwich(s._id).catch(()=>{})}>Copiar rápido</button>
              <button className="arcade-btn alt" onClick={()=> deleteSandwich(s._id)}>Eliminar</button>
            </span>
          </div>
        ))}
        <div className="preview-total">
          {order.totals?.subtotal ? <>Subtotal: ${order.totals.subtotal} — Total: ${order.totals.grandTotal}</> : 'Aún sin precios'}
        </div>
      </div>

      {order.totals?.subtotal ? (
        <div className="pixel-card" style={{marginBottom: 16}}>
          <h3 className="title-sm">Total por persona</h3>
          <table className="tbl">
            <thead><tr><th>Persona</th><th>Total</th></tr></thead>
            <tbody>
              {perPerson.map(([name, amt])=> (
                <tr key={name}><td>{name}</td><td>${amt}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <SharePanel/>
    </div>
  )
}
