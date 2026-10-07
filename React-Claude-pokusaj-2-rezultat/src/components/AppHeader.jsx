import { Bug, Plus, X } from 'lucide-react'

export function AppHeader({ formOpen, onToggleForm }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <a className="brand" href="#top" aria-label="IssueDesk početna strana">
          <span className="brand-icon" aria-hidden="true">
            <Bug size={21} strokeWidth={2.2} />
          </span>
          <span>IssueDesk</span>
        </a>

        <button className="button button-primary" type="button" onClick={onToggleForm}>
          {formOpen ? <X size={18} /> : <Plus size={18} />}
          {formOpen ? 'Zatvori formu' : 'Nova prijava'}
        </button>
      </div>
    </header>
  )
}
