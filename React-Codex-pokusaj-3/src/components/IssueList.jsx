import { ChevronRight, Inbox } from 'lucide-react'
import { PRIORITY_LABELS, STATUS_LABELS, formatIssueDate } from '../lib/issueUtils.js'

export function IssueList({ issues, loading, selectedId, onSelect }) {
  return (
    <section className="panel issue-list-panel" aria-busy={loading}>
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Rezultati</p>
          <h2>Prijave</h2>
        </div>
        <span className="result-count">{issues.length}</span>
      </div>

      {loading ? (
        <div className="loading-list" aria-label="Učitavanje prijava">
          {[1, 2, 3].map((item) => (
            <div className="skeleton-row" key={item} />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <Inbox size={34} aria-hidden="true" />
          <h3>Nema pronađenih prijava</h3>
          <p>Promenite kriterijume pretrage ili dodajte novu prijavu.</p>
        </div>
      ) : (
        <div className="issue-list">
          {issues.map((issue) => (
            <button
              className={`issue-row ${selectedId === issue.id ? 'selected' : ''}`}
              key={issue.id}
              type="button"
              onClick={() => onSelect(issue.id)}
            >
              <span className="issue-row-main">
                <span className="issue-number">#{issue.id}</span>
                <strong>{issue.title}</strong>
                <span className="issue-meta">
                  {issue.owner} · {formatIssueDate(issue.updatedAt)}
                </span>
              </span>
              <span className="issue-row-badges">
                <span className={`badge priority-${issue.priority}`}>
                  {PRIORITY_LABELS[issue.priority]}
                </span>
                <span className={`badge status-${issue.status}`}>
                  {STATUS_LABELS[issue.status]}
                </span>
              </span>
              <ChevronRight className="row-chevron" size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
