import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrder, getOptions, updateSandwich } from '../api'
import { useOrderStore } from '../store'

export default function EditSandwich(){
  const { code, id } = useParams()
  const nav = useNavigate()
  const { order, sandwiches } = useOrderStore()
  const [ownerName, setOwnerName] = useState('')
  const [breadSet, setBreadSet] = useState({options:[]})
  const [proteinSet, setProteinSet] = useState({options:[]})
  const [toppingSet, setToppingSet] = useState({options:[]})
  const [bread, setBread] = useState('')
  const [protein, setProtein] = useState('')
  const [tops, setTops] = useState([])
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('')

  useEffect(()=>{
    (async ()=>{
      setBreadSet(await getOptions('bread'))
      setProteinSet(await getOptions('protein'))
      setToppingSet(await getOptions('topping'))
    })()
  },[])

  useEffect(()=>{
    const sw = sandwiches.find(s=> s._id === id)
    if (sw){
      setOwnerName(sw.ownerName || '')
      setBread(sw.bread?.key || '')
      setProtein(sw.protein?.key || '')
      setTops(sw.toppings?.map(t=>t.key) || [])
      setNotes(sw.notes || '')
      setQuantity(sw.quantity || 1)
      setPrice(sw.price ?? '')
    }
  },[sandwiches, id])

  if(!order) return <div className="screen">Cargando...</div>

  return (
    <div className="screen">
      <h1 className="title">Editar Sándwich</h1>
      <div className="pixel-card grid gap-6">
        <input className="inp" placeholder="Para" value={ownerName} onChange={e=>setOwnerName(e.target.value)} />

        <div>
          <div className="title-sm">Pan</div>
          <div className="chips">
            {breadSet.options.map(o=> (
              <button key={o.key} className={`chip ${bread===o.key?'on':''}`} onClick={()=>setBread(o.key)}>{o.label}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="title-sm">Proteína</div>
          <div className="chips">
            {proteinSet.options.map(o=> (
              <button key={o.key} className={`chip ${protein===o.key?'on':''}`} onClick={()=>setProtein(o.key)}>{o.label}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="title-sm">Toppings</div>
          <div className="chips">
            {toppingSet.options.map(o=> {
              const active = tops.includes(o.key)
              return (
                <button key={o.key} className={`chip ${active?'on':''}`} onClick={()=> setTops(active? tops.filter(k=>k!==o.key) : [...tops, o.key])}>
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>

        <textarea className="inp" placeholder="Notas" value={notes} onChange={e=>setNotes(e.target.value)} />
        <div>
          <div className="title-sm">Cantidad</div>
          <input className="inp" type="number" min="1" value={quantity} onChange={e=>setQuantity(parseInt(e.target.value||'1'))} />
        </div>
        <div>
          <div className="title-sm">Precio (opcional)</div>
          <input className="inp" type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} />
        </div>

        <div className="flex gap-3" style={{flexWrap:'wrap'}}>
          <button className="arcade-btn" onClick={async ()=>{
            await updateSandwich(id, {
              ownerName,
              bread: { key: bread },
              protein: { key: protein },
              toppings: tops.map(k=>({ key: k })),
              notes, quantity,
              price: price === '' ? null : parseInt(price)
            })
            nav(`/o/${code}`)
          }}>Guardar</button>
          <button className="arcade-btn alt" onClick={()=> nav(-1)}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
