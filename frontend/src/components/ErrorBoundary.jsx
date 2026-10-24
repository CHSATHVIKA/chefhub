import { Component } from 'react'

// catches render errors so a crash shows a message instead of a blank white page
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="container-page max-w-xl py-20 text-center">
        <h1 className="text-3xl font-semibold">Something went wrong on this page</h1>
        <p className="mt-3 text-muted">Reloading usually fixes it. If it keeps happening, please let us know.</p>
        <p className="mt-4 rounded-xl bg-line/60 px-4 py-2 font-mono text-xs text-muted">{this.state.error.message}</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload page
          </button>
          <a href="/" className="btn-outline">
            Go home
          </a>
        </div>
      </div>
    )
  }
}
