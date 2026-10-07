import assert from 'node:assert/strict'
import test from 'node:test'
import { seedIssues } from '../src/data/seedIssues.js'
import { filterIssues, getIssueStats } from '../src/lib/issueUtils.js'
import { issueApi } from '../src/services/fakeApi.js'

test('pretraga koristi ceo aktuelni upit', () => {
  const results = filterIssues(seedIssues, { query: 'izvoz podataka' })
  assert.deepEqual(results.map((issue) => issue.id), [105])
})

test('status i prioritet mogu da se kombinuju', () => {
  const results = filterIssues(seedIssues, { status: 'open', priority: 'high' })
  assert.deepEqual(results.map((issue) => issue.id), [101, 104])
})

test('izvedene vrednosti se računaju iz aktuelne kolekcije', () => {
  assert.deepEqual(getIssueStats(seedIssues), {
    total: 5,
    open: 3,
    inProgress: 1,
    closed: 1,
  })
})

test('ažuriranje statusa ne menja prethodno vraćeni objekat', async () => {
  issueApi.reset()
  const before = await issueApi.getById(101, { delay: 0 })
  const updated = await issueApi.update(101, { status: 'closed' }, { delay: 0 })

  assert.equal(before.status, 'open')
  assert.equal(updated.status, 'closed')
})

test('brojači se ažuriraju nakon promene statusa', async () => {
  issueApi.reset()
  await issueApi.update(101, { status: 'closed' }, { delay: 0 })
  const result = await issueApi.list({}, { delay: 0 })

  assert.deepEqual(result.stats, {
    total: 5,
    open: 2,
    inProgress: 1,
    closed: 2,
  })
})

test('dodavanje, filtriranje i brisanje koriste stabilan identifikator', async () => {
  issueApi.reset()
  const created = await issueApi.create(
    {
      title: 'Problem pri slanju obaveštenja',
      description: 'Poruka ne stiže korisniku.',
      priority: 'high',
      owner: 'Ivana',
    },
    { delay: 0 },
  )

  const filtered = await issueApi.list({ priority: 'high' }, { delay: 0 })
  assert.ok(filtered.items.some((issue) => issue.id === created.id))

  await issueApi.remove(created.id, { delay: 0 })
  const allIssues = await issueApi.list({ priority: 'all' }, { delay: 0 })
  assert.equal(allIssues.items.some((issue) => issue.id === created.id), false)
  assert.equal(allIssues.stats.total, 5)
})

test('privremena greška ne sprečava naredni uspešan zahtev', async () => {
  issueApi.reset()
  issueApi.failNextRequest('Simulirana greška')
  await assert.rejects(issueApi.list({}, { delay: 0 }), /Simulirana greška/)

  const recovered = await issueApi.list({}, { delay: 0 })
  assert.equal(recovered.items.length, 5)
})

test('otkazani zahtev ne vraća rezultat', async () => {
  issueApi.reset()
  const controller = new AbortController()
  const pendingRequest = issueApi.list({}, { delay: 50, signal: controller.signal })
  controller.abort()

  await assert.rejects(pendingRequest, (error) => error.name === 'AbortError')
})
