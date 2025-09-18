import React, { useEffect, useMemo, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useOrderStore } from '../store'

export default function OrderShareAndThemePanel(){
  const { order, sandwiches } = useOrderStore()
  const [theme, setTheme] = useTheme()
  const baseUrl = window.location.origin
  const joinUrl = `${baseUrl}/o/${order?.code}`

  const waText = useMemo(() => buildWhatsAppText({ order, sandwiches, joinUrl }), [order, sandwiches, joinUrl])

  const copyWA = async () => {
    try { await navigator.clipboard.writeText(waText); toast('Resumen copiado ✂️') }
    catch { alert('No se pudo copiar. Probá manualmente.') }
  }

  if(!order) return null

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="pixel-card">
        <h2 className="title">Unirse al pedido</h2>
        <p className="sub">Escaneá el QR o compartí el link</p>
        <div className="qr-wrap">
          <QRCodeCanvas value={joinUrl} size={220} includeMargin={true} />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <a className="arcade-btn" href={joinUrl} target="_blank" rel="noreferrer">Abrir pedido</a>
          <button className="arcade-btn alt" onClick={() => shareLink(joinUrl)}>Compartir link</button>
        </div>
        <div className="divider" />
        <h3 className="title-sm">WhatsApp</h3>
        <div className="wa-box">
          <textarea className="wa-text" readOnly value={waText} />
          <div className="flex gap-3 mt-3 flex-wrap">
            <a className="arcade-btn" href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer">Enviar por WhatsApp</a>
            <button className="arcade-btn alt" onClick={copyWA}>Copiar resumen</button>
          </div>
        </div>
      </div>

      <div className="pixel-card">
        <h2 className="title">Apariencia</h2>
        <p className="sub">Elegí tu modo favorito</p>
        <div className="theme-toggle">
          <button className={`arcade-btn ${theme==='crt'?'active':''}`} onClick={()=>setTheme('crt')}>CRT (Arcade)</button>
          <button className={`arcade-btn alt ${theme==='gameboy'?'active':''}`} onClick={()=>setTheme('gameboy')}>Game Boy</button>
        </div>
        <div className="preview">
          <div className="preview-card">
            <div className="coin" />
            <div className="preview-title">{order.title}</div>
            <div className="preview-sub">Código: {order.code}</div>
            <div className="preview-list">
              {sandwiches.map(s=> (
                <div key={s._id} className="preview-item">
                  <span>👤 {s.ownerName}</span>
                  <span>🥖 {s.bread.label}</span>
                  <span>🍗 {s.protein.label}</span>
                  <span>➕ {s.toppings.map(t=>t.label).join(', ') || '—'}</span>
                  <span>✍️ {s.notes || '—'}</span>
                  <span>💸 ${s.total}</span>
                </div>
              ))}
            </div>
            <div className="preview-total">Total: ${order.totals?.grandTotal || 0}</div>
            <a className="arcade-btn" href={`/o/${order.code}/new`}>Agregar sándwich</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function useTheme(){
  const [theme,setTheme] = useState(()=> localStorage.getItem('ebl-theme') || 'crt')
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ebl-theme', theme)
  },[theme])
  return [theme,setTheme]
}

function shareLink(url){
  if(navigator.share){
    navigator.share({ title:'Unite al pedido de El Buen Libro', text:'Sumá tu sándwich acá:', url }).catch(()=>{})
  } else {
    navigator.clipboard.writeText(url)
    alert('Link copiado al portapapeles')
  }
}

function buildWhatsAppText({ order, sandwiches, joinUrl }){
  if(!order) return ''
  const header = `📖 *${order.restaurant}* — ${order.title}\n🔗 Unirse: ${joinUrl}\n\n`
  const lines = (sandwiches||[]).map((s, i)=>{
    const tops = s.toppings?.map(t=>t.label).join(', ') || '—'
    const notes = s.notes ? ` — _${s.notes}_` : ''
    return `${i+1}. ${s.ownerName} x${s.quantity}: ${s.bread.label}, ${s.protein.label}, ${tops}${notes} — $${s.total}`
  })
  const fees = []
  if (order.deliveryFee) fees.push(`Delivery: $${order.deliveryFee}`)
  if (order.tipPercent) fees.push(`Propina: ${order.tipPercent}%`)
  const footer = `\nSubtotal: $${order.totals?.subtotal||0}\n${fees.join('\n')}\n*TOTAL: $${order.totals?.grandTotal||0}*`
  return [header, ...lines, footer].join('\n')
}

function toast(msg){
  const el = document.createElement('div')
  el.className = 'mini-toast'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(()=> el.classList.add('show'), 10)
  setTimeout(()=> { el.classList.remove('show'); setTimeout(()=> el.remove(), 300) }, 1800)
}
