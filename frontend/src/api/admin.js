import client from './client'

export const getAllChefs = () => client.get('/admin/chefs').then((res) => res.data)

export const approveChef = (id) => client.patch(`/admin/chefs/${id}/approve`).then((res) => res.data)

export const blockChef = (id) => client.patch(`/admin/chefs/${id}/block`).then((res) => res.data)

export const getAllBookings = () => client.get('/admin/bookings').then((res) => res.data)
