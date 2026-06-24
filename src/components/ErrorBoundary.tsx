'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * Catches any render error in the app tree and shows a calm, branded fallback
 * rather than a blank page. Important for a link opened unattended on an
 * unknown device — a single chart hiccup should never look like a dead site.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== 'undefined') console.error('UI error caught by boundary:', error)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    if (typeof window !== 'undefined') window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent shadow-glow">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-xl font-bold tracking-tight text-white">
          A panel hit a snag
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          The command center caught the error before it could take the page down. A quick reload
          restores it.
        </p>
        <button
          onClick={this.handleReload}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-4 py-2.5 text-sm font-semibold text-base-950 shadow-[0_8px_24px_-8px_rgba(47,134,224,0.8)] transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Reload command center
        </button>
        <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-slate-600">
          Demo data — interview prototype only
        </p>
      </div>
    )
  }
}
