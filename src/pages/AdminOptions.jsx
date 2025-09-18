import React, { useEffect, useState } from 'react'
import { getOptions, putOptions } from '../api'

function TypeEditor({ type }){
  const [setData, setSetData] = useState({ type, options: [] })
  const [dirty, setDirty] = useState(false)

  useEffect(()=>{ (async ()=> setSetData(await getOptions(type)))() },[type])

  const addRow = ()=> { setSetData(s => ({...s, options: [...s.options, { key:'', label:'', price:0, isAvailable:true }]})); setDirty(true) }
  const update = (i, patch)=> { setSetData(s=>{ const opts=[...s.options]; opts[i]={...opts[i], ...patch}; return {...s, options: opts} }); setDirty(true) }

  return (
    <div className="pixel-card">
      <h3 className="title-sm">{type.toUpperCase()}</h3>
      <table className="tbl">
        <thead><tr><th>key</th><th>label</th><th>price</th><th>ok?</th></tr></thead>
        <tbody>
          {setData.options.map((o,i)=>(
            <tr key={i}>
              <td><input className="inp" value={o.key} onChange={e=>update(i,{key:e.target.value})}/></td>
              <td><input className="inp" value={o.label} onChange={e=>update(i,{label:e.target.value})}/></td>
              <td><input className="inp" type="number" value={o.price} onChange={e=>update(i,{price:parseInt(e.target.value||'0')})}/></td>
              <td><input type="checkbox" checked={o.isAvailable} onChange={e=>update(i,{isAvailable:e.target.checked})}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-3" style={{marginTop:8, flexWrap:'wrap'}}>
        <button className="arcade-btn" onClick={addRow}>+ Agregar</button>
        <button className="arcade-btn" disabled={!dirty} onClick={async ()=>{
          await putOptions(type, { options: setData.options })
          setDirty(false)
          alert('Guardado')
        }}>Guardar</button>
      </div>
    </div>
  )
}

export default function AdminOptions(){
  return (
    <div className="screen">
      <h1 className="title">Catálogo</h1>
      <p className="sub">Administrá panes, proteínas y toppings</p>
      <div className="grid gap-6 md:grid-cols-3">
        <TypeEditor type="bread" />
        <TypeEditor type="protein" />
        <TypeEditor type="topping" />
      </div>
    </div>
  )
}
