import client from './client'

export const searchChefs = (params) => client.get('/chefs', { params }).then((res) => res.data)

export const getChef = (id) => client.get(`/chefs/${id}`).then((res) => res.data)
