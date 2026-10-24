import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/Home'
import ChefList from './pages/ChefList'
import ChefDetails from './pages/ChefDetails'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import ChefDashboard from './pages/ChefDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chefs" element={<ChefList />} />
          <Route path="/chefs/:id" element={<ChefDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
            <Route path="/book/:chefId/:slotId" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          <Route element={<ProtectedRoute roles={['CHEF']} />}>
            <Route path="/chef/dashboard" element={<ChefDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
