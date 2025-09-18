import { create } from 'zustand'
import { io } from 'socket.io-client'
import { getOrder } from './api'

export const useOrderStore = create((set,get)=> ({
  socket: null,
  order: null,
  sandwiches: [],
  connect: async (code) => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    socket.emit('join:order', { code });
    socket.on('order:update', (order)=> set({ order }));
    socket.on('sandwich:added', (sw)=> set({ sandwiches: [...get().sandwiches, sw] }));
    socket.on('sandwich:updated', (sw)=> set({ sandwiches: get().sandwiches.map(x=>x._id===sw._id? sw : x) }));
    socket.on('sandwich:deleted', (id)=> set({ sandwiches: get().sandwiches.filter(x=>x._id!==id) }));
    set({ socket });
    const data = await getOrder(code);
    set({ order: data.order, sandwiches: data.sandwiches });
  }
}))
