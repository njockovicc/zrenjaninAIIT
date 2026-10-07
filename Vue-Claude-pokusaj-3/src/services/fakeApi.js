import { seedIssues } from '../data/seedIssues.js'
import { filterIssues, getIssueStats } from '../lib/issueUtils.js'

let database = structuredClone(seedIssues)
let nextId = Math.max(...database.map((issue) => issue.id)) + 1
let pendingFailure = null

function abortError() {
  return new DOMException('Zahtev je otkazan.', 'AbortError')
}

function wait(delay, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const timeoutId = setTimeout(resolve, delay)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId)
        reject(abortError())
      },
      { once: true },
    )
  })
}

async function beforeResponse(options = {}) {
  await wait(options.delay ?? 220, options.signal)
  if (pendingFailure) {
    const message = pendingFailure
    pendingFailure = null
    throw new Error(message)
  }
}

function clone(value) {
  return structuredClone(value)
}

export const issueApi = {
  async list(filters = {}, options = {}) {
    const queryLength = (filters.query ?? '').trim().length
    const delay = options.delay ?? Math.max(140, 520 - queryLength * 45)
    await beforeResponse({ ...options, delay })

    return {
      items: clone(filterIssues(database, filters)),
      stats: getIssueStats(database),
    }
  },

  async getById(id, options = {}) {
    await beforeResponse(options)
    const issue = database.find((item) => item.id === Number(id))
    if (!issue) throw new Error('Izabrana prijava više ne postoji.')
    return clone(issue)
  },

  async create(input, options = {}) {
    await beforeResponse(options)
    const now = new Date().toISOString()
    const issue = {
      id: nextId++,
      title: input.title.trim(),
      description: input.description.trim(),
      status: 'open',
      priority: input.priority,
      owner: input.owner.trim() || 'Nedodeljeno',
      createdAt: now,
      updatedAt: now,
    }
    database = [issue, ...database]
    return clone(issue)
  },

  async update(id, changes, options = {}) {
    await beforeResponse(options)
    const index = database.findIndex((item) => item.id === Number(id))
    if (index === -1) throw new Error('Prijava nije pronađena.')

    const updatedIssue = {
      ...database[index],
      ...changes,
      id: database[index].id,
      updatedAt: new Date().toISOString(),
    }
    database = database.map((item, itemIndex) =>
      itemIndex === index ? updatedIssue : item,
    )
    return clone(updatedIssue)
  },

  async remove(id, options = {}) {
    await beforeResponse(options)
    const numericId = Number(id)
    if (!database.some((item) => item.id === numericId)) {
      throw new Error('Prijava nije pronađena.')
    }
    database = database.filter((item) => item.id !== numericId)
    return { id: numericId }
  },

  async removeAt(index, options = {}) {
    await beforeResponse(options)
    if (index < 0 || index >= database.length) {
      throw new Error('Prijava nije pronađena.')
    }
    const removedIssue = database[index]
    database = database.filter((_, itemIndex) => itemIndex !== index)
    return { id: removedIssue.id }
  },

  failNextRequest(message = 'Došlo je do privremene greške na serveru.') {
    pendingFailure = message
  },

  reset() {
    database = structuredClone(seedIssues)
    nextId = Math.max(...database.map((issue) => issue.id)) + 1
    pendingFailure = null
  },
}
