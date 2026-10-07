export const STATUS_LABELS = {
  open: 'Otvoreno',
  'in-progress': 'U obradi',
  closed: 'Zatvoreno',
}

export const PRIORITY_LABELS = {
  low: 'Nizak',
  medium: 'Srednji',
  high: 'Visok',
}

export function filterIssues(issues, filters = {}) {
  const normalizedQuery = (filters.query ?? '').trim().toLocaleLowerCase('sr')

  return issues.filter((issue) => {
    const searchableText = `${issue.title} ${issue.description} ${issue.owner}`
      .toLocaleLowerCase('sr')
    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery)
    const matchesStatus =
      !filters.status || filters.status === 'all' || issue.status === filters.status
    const matchesPriority =
      !filters.priority ||
      filters.priority === 'all' ||
      issue.priority === filters.priority

    return matchesQuery && matchesStatus && matchesPriority
  })
}

export function getIssueStats(issues) {
  return issues.reduce(
    (stats, issue) => {
      stats.total += 1
      if (issue.status === 'open') stats.open += 1
      if (issue.status === 'in-progress') stats.inProgress += 1
      if (issue.status === 'closed') stats.closed += 1
      return stats
    },
    { total: 0, open: 0, inProgress: 0, closed: 0 },
  )
}

export function formatIssueDate(value) {
  return new Intl.DateTimeFormat('sr-Latn-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
