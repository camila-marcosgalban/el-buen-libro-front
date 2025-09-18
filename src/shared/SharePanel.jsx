import React, { useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useOrderStore } from '../store'

export default function SharePanel(){
  const { order, sandwiches } = useOrderStore()
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
      </div>

      <div className="pixel-card">
        <h3 className="title-sm">WhatsApp</h3>
        <div className="wa-box">
          <textarea className="wa-text" readOnly value={waText} />
          <div className="flex gap-3 mt-3 flex-wrap">
            <a className="arcade-btn" href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer">Enviar por WhatsApp</a>
            <button className="arcade-btn alt" onClick={copyWA}>Copiar resumen</button>
          </div>
        </div>
      </div>
    </div>
  )
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
    const price = (s.price != null) ? ` — $${s.price}` : ''
    return `${i+1}. Para: ${s.ownerName} x${s.quantity}: ${s.bread.label}, ${s.protein.label}, ${tops}${notes}${price}`
  })

  let totals = ''
  if (order.totals?.subtotal){
    // per-person rollup
    const per = {}
    for (const s of (sandwiches||[])){
      const name = s.ownerName || '—'
      const amt = s.price || 0
      per[name] = (per[name]||0) + amt
    }
    const perLines = Object.entries(per).sort((a,b)=> a[0].localeCompare(b[0])).map(([n,a])=> `- ${n}: $${a}`).join('\n')
    totals = `\nPor persona:\n${perLines}\n\nSubtotal: $${order.totals.subtotal}\n*TOTAL: $${order.totals.grandTotal}*`
  }

  return [header, ...lines, totals].join('\n')
}

function toast(msg){
  const el = document.createElement('div')
  el.className = 'mini-toast'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(()=> el.classList.add('show'), 10)
  setTimeout(()=> { el.classList.remove('show'); setTimeout(()=> el.remove(), 300) }, 1800)
}
