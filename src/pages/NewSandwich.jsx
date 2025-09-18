import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { addSandwich, getOptions } from '../api'
import { useOrderStore } from '../store'

export default function NewSandwich(){
  const { code } = useParams()
  const [query] = useSearchParams()
  const copyId = query.get('copy')
  const nav = useNavigate()
  const { sandwiches } = useOrderStore()

  const [ownerName, setOwnerName] = useState('')
  const [breadSet, setBreadSet] = useState({options:[]})
  const [proteinSet, setProteinSet] = useState({options:[]})
  const [toppingSet, setToppingSet] = useState({options:[]})
  const [bread, setBread] = useState('')
  const [protein, setProtein] = useState('')
  const [tops, setTops] = useState([])
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('') // opcional

  useEffect(()=>{
    (async ()=>{
      const b = await getOptions('bread'); setBreadSet(b); setBread(b.options[0]?.key || '')
      const p = await getOptions('protein'); setProteinSet(p); setProtein(p.options[0]?.key || '')
      const t = await getOptions('topping'); setToppingSet(t)
    })()
  },[])

  useEffect(()=>{
    if (copyId){
      const sw = sandwiches.find(s=> s._id === copyId)
      if (sw){
        setOwnerName(sw.ownerName || '')
        setBread(sw.bread?.key || '')
        setProtein(sw.protein?.key || '')
        setTops(sw.toppings?.map(t=>t.key) || [])
        setNotes(sw.notes || '')
        setQuantity(sw.quantity || 1)
        setPrice(sw.price ?? '')
      }
    }
  }, [copyId, sandwiches])

  function randomize(){
    const pick = arr => arr.length? arr[Math.floor(Math.random()*arr.length)].key : ''
    const randBread = pick(breadSet.options)
    const randProtein = pick(proteinSet.options)
    const randTops = toppingSet.options
      .filter(()=> Math.random() < 0.4)
      .map(o=>o.key)
    setBread(randBread); setProtein(randProtein); setTops(randTops)
  }

  async function save(withAutoPrice){
    await addSandwich(code, {
      ownerName,
      bread: { key: bread },
      protein: { key: protein },
      toppings: tops.map(k=>({ key: k })),
      notes, quantity,
      price: withAutoPrice ? null : (price === '' ? undefined : parseInt(price))
    })
    nav(`/o/${code}`)
  }

  return (
    <div className="screen">
      <h1 className="title">Nuevo Sándwich</h1>
      <div className="pixel-card grid gap-6">
        <input className="inp" placeholder="Para (tu nombre)" value={ownerName} onChange={e=>setOwnerName(e.target.value)} />

        <div className="flex gap-3" style={{flexWrap:'wrap'}}>
          <button className="arcade-btn" onClick={randomize}>🎲 Random</button>
          <button className="arcade-btn alt" onClick={()=> { setTops([]); setNotes('') }}>Limpiar</button>
        </div>

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

        <textarea className="inp" placeholder="Notas (sin tomate, etc.)" value={notes} onChange={e=>setNotes(e.target.value)} />
        <div>
          <div className="title-sm">Cantidad</div>
          <input className="inp" type="number" min="1" value={quantity} onChange={e=>setQuantity(parseInt(e.target.value||'1'))} />
        </div>

        <div>
          <div className="title-sm">Precio (opcional) — Dejá vacío para mantener / Null para auto</div>
          <input className="inp" type="number" min="0" placeholder="Ej: 2500" value={price} onChange={e=>setPrice(e.target.value)} />
        </div>

        <div className="flex gap-3" style={{flexWrap:'wrap'}}>
          <button className="arcade-btn" onClick={()=> save(false)}>Agregar</button>
          <button className="arcade-btn" onClick={()=> save(true)}>Agregar con precio automático</button>
          <button className="arcade-btn alt" onClick={()=> nav(-1)}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
