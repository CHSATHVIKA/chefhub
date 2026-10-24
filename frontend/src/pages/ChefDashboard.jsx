import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncomingBookings, getMyProfile } from '../api/chefDashboard'
import { getErrorMessage } from '../api/client'
import Avatar from '../components/Avatar'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import Tabs from '../components/Tabs'
import IncomingBookings from '../components/chef/IncomingBookings'
import MenuManager from '../components/chef/MenuManager'
import ProfileForm from '../components/chef/ProfileForm'
import SlotManager from '../components/chef/SlotManager'
import { formatPrice, greeting } from '../utils/format'

const TABS = ['Requests', 'Profile', 'Menu', 'Slots']

export default function ChefDashboard() {
  const [tab, setTab] = useState('Requests')
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getMyProfile(), getIncomingBookings()])
      .then(([profileData, bookingData]) => {
        setProfile(profileData)
        setBookings(bookingData)
        if (!profileData.city) setTab('Profile')
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (error) {
    return (
      <div className="container-page py-10">
        <ErrorMessage message={error} />
      </div>
    )
  }
  if (!profile) return <Loader text="Opening your kitchen..." />

  const count = (status) => bookings.filter((b) => b.status === status).length
  const earnings = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} src={profile.photoUrl} size="lg" />
          <div>
            <p className="text-sm text-muted">{greeting()},</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{profile.name}</h1>
          </div>
        </div>
        {profile.approved ? (
          <Link to={`/chefs/${profile.id}`} className="btn-outline">
            View public profile <Icon name="arrow" className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Waiting for approval
          </span>
        )}
      </div>

      {!profile.approved && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Icon name="info" className="h-5 w-5 shrink-0" />
          <p>
            Your profile is waiting for admin approval. Fill in your profile, add a few dishes and some slots so our
            team can review it. You will appear in search once approved.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New requests" value={count('PENDING')} icon="info" hint="Waiting for your reply" />
        <StatCard label="Upcoming visits" value={count('CONFIRMED')} icon="calendar" />
        <StatCard label="Completed" value={count('COMPLETED')} icon="check" />
        <StatCard label="Earned" value={formatPrice(earnings)} icon="rupee" hint="From completed visits" />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} counts={{ Requests: count('PENDING') }} />

      <div className="mt-6 animate-fade-up" key={tab}>
        {tab === 'Requests' && <IncomingBookings bookings={bookings} onChange={setBookings} />}
        {tab === 'Profile' && <ProfileForm profile={profile} onSaved={setProfile} />}
        {tab === 'Menu' && <MenuManager />}
        {tab === 'Slots' && <SlotManager />}
      </div>
    </div>
  )
}
