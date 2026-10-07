import { CheckCircle2, CircleDot, ListChecks, LoaderCircle } from 'lucide-react'

const cards = [
  { key: 'total', label: 'Ukupno', icon: ListChecks, tone: 'neutral' },
  { key: 'open', label: 'Otvoreno', icon: CircleDot, tone: 'blue' },
  { key: 'inProgress', label: 'U obradi', icon: LoaderCircle, tone: 'amber' },
  { key: 'closed', label: 'Zatvoreno', icon: CheckCircle2, tone: 'green' },
]

export function IssueStats({ stats }) {
  return (
    <section className="stats-grid" aria-label="Sažetak prijava">
      {cards.map(({ key, label, icon: Icon, tone }) => (
        <article className={`stat-card stat-${tone}`} key={key}>
          <span className="stat-icon" aria-hidden="true">
            <Icon size={20} />
          </span>
          <div>
            <p>{label}</p>
            <strong>{stats[key]}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}
