import { useEffect, useState } from 'react'
import { getMyProfile } from '../api/chefDashboard'
import { getErrorMessage } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import Tabs from '../components/Tabs'
import IncomingBookings from '../components/chef/IncomingBookings'
import MenuManager from '../components/chef/MenuManager'
import ProfileForm from '../components/chef/ProfileForm'
import SlotManager from '../components/chef/SlotManager'

const TABS = ['Bookings', 'Profile', 'Menu', 'Slots']

export default function ChefDashboard() {
  const [tab, setTab] = useState('Bookings')
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data)
        if (!data.city) setTab('Profile')
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

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-semibold">Your kitchen</h1>
      <p className="mt-2 text-muted">Manage your profile, dishes, availability and booking requests.</p>

      {!profile.approved && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your profile is waiting for admin approval. Complete your profile, menu and slots so we can review it.
          You will appear in search once approved.
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'Bookings' && <IncomingBookings />}
        {tab === 'Profile' && <ProfileForm profile={profile} onSaved={setProfile} />}
        {tab === 'Menu' && <MenuManager />}
        {tab === 'Slots' && <SlotManager />}
      </div>
    </div>
  )
}
