import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <div className="container-page max-w-xl py-16">
      <EmptyState
        title="This page is off the menu"
        text="The link may be old or mistyped."
        action={
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        }
      />
    </div>
  )
}
