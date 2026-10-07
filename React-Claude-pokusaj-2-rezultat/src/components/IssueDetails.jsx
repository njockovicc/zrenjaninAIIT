import { useEffect, useState } from 'react'
import { CalendarClock, LoaderCircle, RefreshCw, Trash2, UserRound } from 'lucide-react'
import { issueApi } from '../services/fakeApi.js'
import { PRIORITY_LABELS, STATUS_LABELS, formatIssueDate } from '../lib/issueUtils.js'

export function IssueDetails({ issueId, refreshToken, onStatusChange, onDelete }) {
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (issueId == null) {
      setIssue(null)
      setError('')
      return undefined
    }

    let active = true
    let requestController = null

    async function loadIssue(showLoader = false) {
      requestController?.abort()
      requestController = new AbortController()
      if (showLoader) setLoading(true)

      try {
        const result = await issueApi.getById(issueId, {
          signal: requestController.signal,
        })
        if (active) {
          setIssue(result)
          setError('')
        }
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      } finally {
        if (active && showLoader) setLoading(false)
      }
    }

    loadIssue(true)
    const intervalId = setInterval(() => loadIssue(false), 30_000)

    return () => {
      active = false
      clearInterval(intervalId)
      requestController?.abort()
    }
  }, [issueId, refreshToken])

  if (issueId == null) {
    return (
      <aside className="panel details-panel empty-details">
        <span className="details-placeholder-icon">#</span>
        <h2>Izaberite prijavu</h2>
        <p>Detalji izabrane prijave biće prikazani na ovom mestu.</p>
      </aside>
    )
  }

  if (loading && !issue) {
    return (
      <aside className="panel details-panel details-loading" aria-label="Učitavanje detalja">
        <LoaderCircle className="spin" size={26} />
        <span>Učitavanje detalja…</span>
      </aside>
    )
  }

  if (error && !issue) {
    return (
      <aside className="panel details-panel empty-details">
        <h2>Detalji nisu dostupni</h2>
        <p>{error}</p>
      </aside>
    )
  }

  if (!issue) return null

  return (
    <aside className="panel details-panel">
      <div className="details-title-row">
        <div>
          <p className="eyebrow">Prijava #{issue.id}</p>
          <h2>{issue.title}</h2>
        </div>
        <span className={`badge priority-${issue.priority}`}>
          {PRIORITY_LABELS[issue.priority]}
        </span>
      </div>

      {error && <p className="inline-warning">Automatsko osvežavanje nije uspelo.</p>}

      <p className="issue-description">{issue.description}</p>

      <dl className="details-list">
        <div>
          <dt><UserRound size={16} /> Odgovorna osoba</dt>
          <dd>{issue.owner}</dd>
        </div>
        <div>
          <dt><CalendarClock size={16} /> Poslednja izmena</dt>
          <dd>{formatIssueDate(issue.updatedAt)}</dd>
        </div>
        <div>
          <dt><RefreshCw size={16} /> Automatsko osvežavanje</dt>
          <dd>Na svakih 30 sekundi</dd>
        </div>
      </dl>

      <label className="status-control">
        <span>Status prijave</span>
        <select
          value={issue.status}
          onChange={(event) => onStatusChange(issue.id, event.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <button className="button button-danger" type="button" onClick={() => onDelete(issue.id)}>
        <Trash2 size={17} />
        Obriši prijavu
      </button>
    </aside>
  )
}
