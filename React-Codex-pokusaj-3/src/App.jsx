import { useEffect, useState } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { AppHeader } from './components/AppHeader.jsx'
import { IssueDetails } from './components/IssueDetails.jsx'
import { IssueFilters } from './components/IssueFilters.jsx'
import { IssueForm } from './components/IssueForm.jsx'
import { IssueList } from './components/IssueList.jsx'
import { IssueStats } from './components/IssueStats.jsx'
import { issueApi } from './services/fakeApi.js'

const EMPTY_STATS = { total: 0, open: 0, inProgress: 0, closed: 0 }

export default function App() {
  const [issues, setIssues] = useState([])
  const [stats, setStats] = useState(EMPTY_STATS)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    async function loadIssues() {
      setLoading(true)
      try {
        const result = await issueApi.list({ query: searchQuery, status, priority })
        if (!active) return

        setIssues(result.items)
        setStats(result.stats)
        setError('')

        setSelectedId((currentId) => {
          if (currentId != null && result.items.some((issue) => issue.id === currentId)) {
            return currentId
          }
          return result.items[0]?.id ?? null
        })
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadIssues()

    return () => {
      active = false
    }
  }, [searchQuery, status, priority, refreshToken])

  function handleFilterChange(field, value) {
    if (field === 'query') {
      setQuery(value)
      setSearchQuery(value)
    }
    if (field === 'status') setStatus(value)
    if (field === 'priority') setPriority(value)
  }

  function refreshData() {
    setRefreshToken((current) => current + 1)
  }

  async function handleCreate(input) {
    setSubmitting(true)
    try {
      const createdIssue = await issueApi.create(input)
      setError('')
      setSelectedId(createdIssue.id)
      hasInitializedSelection.current = true
      setFormOpen(false)
      refreshData()
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(id, nextStatus) {
    try {
      const updatedIssue = await issueApi.update(id, { status: nextStatus })
      setIssues((currentIssues) =>
        currentIssues.map((issue) => (issue.id === id ? updatedIssue : issue)),
      )
      setError('')
      refreshData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleDelete(id) {
    try {
      await issueApi.remove(id)
      setSelectedId((currentId) => {
        if (currentId !== id) return currentId

        const visibleIndex = issues.findIndex((issue) => issue.id === id)
        const fallbackIssue = issues[visibleIndex + 1] ?? issues[visibleIndex - 1] ?? null
        return fallbackIssue?.id ?? null
      })
      setError('')
      refreshData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function handleSelect(id) {
    setSelectedId(id)
  }

  return (
    <div id="top" className="app-shell">
      <AppHeader formOpen={formOpen} onToggleForm={() => setFormOpen((open) => !open)} />

      <main className="page-content">
        <section className="page-intro">
          <div>
            <p className="eyebrow">Kontrolna tabla</p>
            <h1>Upravljanje prijavljenim problemima</h1>
            <p>Pratite, filtrirajte i ažurirajte prijave na jednom mestu.</p>
          </div>
          <span className="reference-label">Pregled prijava</span>
        </section>

        <IssueStats stats={stats} />

        {formOpen && (
          <IssueForm
            submitting={submitting}
            onSubmit={handleCreate}
            onCancel={() => setFormOpen(false)}
          />
        )}

        <IssueFilters
          query={query}
          status={status}
          priority={priority}
          onChange={handleFilterChange}
        />

        {error && (
          <div className="error-banner" role="alert">
            <AlertTriangle size={19} />
            <span>{error}</span>
            <button className="button button-ghost" type="button" onClick={refreshData}>
              <RotateCcw size={16} />
              Pokušaj ponovo
            </button>
          </div>
        )}

        <div className="workspace-grid">
          <IssueList
            issues={issues}
            loading={loading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
          <IssueDetails
            issueId={selectedId}
            refreshToken={refreshToken}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <footer>IssueDesk · Eksperimentalna React/Vite aplikacija</footer>
    </div>
  )
}
