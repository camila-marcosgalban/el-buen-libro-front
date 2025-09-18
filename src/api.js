const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function createOrder(body){
  const r = await fetch(`${API}/api/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return r.json();
}
export async function getOrder(code){
  const r = await fetch(`${API}/api/orders/${code}`);
  return r.json();
}
export async function patchOrder(code, body){
  const r = await fetch(`${API}/api/orders/${code}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return r.json();
}
export async function addSandwich(code, body){
  const r = await fetch(`${API}/api/sandwiches/${code}/sandwiches`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return r.json();
}
export async function updateSandwich(id, body){
  const r = await fetch(`${API}/api/sandwiches/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return r.json();
}
export async function duplicateSandwich(id, body){
  const r = await fetch(`${API}/api/sandwiches/${id}/duplicate`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body || {}) });
  return r.json();
}
export async function deleteSandwich(id){
  const r = await fetch(`${API}/api/sandwiches/${id}`, { method:'DELETE' });
  return r.json();
}
export async function getOptions(type){
  const r = await fetch(`${API}/api/options/${type}`);
  return r.json();
}
export async function putOptions(type, body){
  const r = await fetch(`${API}/api/options/${type}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return r.json();
}
