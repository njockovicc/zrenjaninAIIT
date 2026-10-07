import { Search } from 'lucide-react'

export function IssueFilters({ query, status, priority, onChange }) {
  return (
    <section className="filters" aria-label="Pretraga i filtriranje prijava">
      <label className="search-field">
        <span className="sr-only">Pretraži prijave</span>
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder="Pretraži po naslovu, opisu ili odgovornoj osobi…"
          onChange={(event) => onChange('query', event.target.value)}
        />
      </label>

      <label>
        <span>Status</span>
        <select value={status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="all">Svi statusi</option>
          <option value="open">Otvoreno</option>
          <option value="in-progress">U obradi</option>
          <option value="closed">Zatvoreno</option>
        </select>
      </label>

      <label>
        <span>Prioritet</span>
        <select
          value={priority}
          onChange={(event) => onChange('priority', event.target.value)}
        >
          <option value="all">Svi prioriteti</option>
          <option value="high">Visok</option>
          <option value="medium">Srednji</option>
          <option value="low">Nizak</option>
        </select>
      </label>
    </section>
  )
}
