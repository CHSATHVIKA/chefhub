import client from './client'

export const createBooking = (data) => client.post('/bookings', data).then((res) => res.data)

export const getMyBookings = () => client.get('/bookings/my').then((res) => res.data)

export const cancelBooking = (id) => client.patch(`/bookings/${id}/cancel`).then((res) => res.data)
