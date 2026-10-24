import client from './client'

export const getMyProfile = () => client.get('/chef/profile').then((res) => res.data)
export const updateMyProfile = (data) => client.put('/chef/profile', data).then((res) => res.data)

export const getMyMenu = () => client.get('/chef/menu').then((res) => res.data)
export const addMenuItem = (data) => client.post('/chef/menu', data).then((res) => res.data)
export const updateMenuItem = (id, data) => client.put(`/chef/menu/${id}`, data).then((res) => res.data)
export const deleteMenuItem = (id) => client.delete(`/chef/menu/${id}`)

export const getMySlots = () => client.get('/chef/slots').then((res) => res.data)
export const addSlot = (data) => client.post('/chef/slots', data).then((res) => res.data)
export const deleteSlot = (id) => client.delete(`/chef/slots/${id}`)

export const getIncomingBookings = () => client.get('/chef/bookings').then((res) => res.data)
export const updateBookingStatus = (id, status) =>
  client.patch(`/chef/bookings/${id}/status`, { status }).then((res) => res.data)
