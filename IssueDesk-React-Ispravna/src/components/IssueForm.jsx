import { useState } from 'react'
import { LoaderCircle, Save } from 'lucide-react'

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  owner: '',
}

export function IssueForm({ submitting, onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [validationError, setValidationError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (validationError) setValidationError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      setValidationError('Naslov i opis prijave su obavezni.')
      return
    }

    const wasCreated = await onSubmit(form)
    if (wasCreated) setForm(INITIAL_FORM)
  }

  return (
    <section className="panel issue-form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nova prijava</p>
          <h2>Prijavite problem</h2>
        </div>
        <button className="button button-ghost" type="button" onClick={onCancel}>
          Otkaži
        </button>
      </div>

      <form className="issue-form" onSubmit={handleSubmit} noValidate>
        <label className="full-width">
          <span>Naslov *</span>
          <input
            type="text"
            value={form.title}
            maxLength={100}
            placeholder="Kratak opis problema"
            onChange={(event) => updateField('title', event.target.value)}
          />
        </label>

        <label className="full-width">
          <span>Opis *</span>
          <textarea
            value={form.description}
            rows={4}
            maxLength={600}
            placeholder="Opišite uočeno ponašanje…"
            onChange={(event) => updateField('description', event.target.value)}
          />
        </label>

        <label>
          <span>Prioritet</span>
          <select
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            <option value="low">Nizak</option>
            <option value="medium">Srednji</option>
            <option value="high">Visok</option>
          </select>
        </label>

        <label>
          <span>Odgovorna osoba</span>
          <input
            type="text"
            value={form.owner}
            maxLength={50}
            placeholder="Npr. Ana"
            onChange={(event) => updateField('owner', event.target.value)}
          />
        </label>

        {validationError && (
          <p className="form-error full-width" role="alert">
            {validationError}
          </p>
        )}

        <div className="form-actions full-width">
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {submitting ? 'Čuvanje…' : 'Sačuvaj prijavu'}
          </button>
        </div>
      </form>
    </section>
  )
}
