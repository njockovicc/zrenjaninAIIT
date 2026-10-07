<script setup>
import { ref, watch } from 'vue'
import { CalendarClock, LoaderCircle, RefreshCw, Trash2, UserRound } from '@lucide/vue'
import { issueApi } from '../services/fakeApi.js'
import { PRIORITY_LABELS, STATUS_LABELS, formatIssueDate } from '../lib/issueUtils.js'

const props = defineProps({
  issueId: { type: Number, default: null },
  refreshToken: { type: Number, required: true },
})

defineEmits(['status-change', 'delete'])

const issue = ref(null)
const loading = ref(false)
const error = ref('')

watch(
  () => [props.issueId, props.refreshToken],
  ([issueId], _previous, onCleanup) => {
    if (issueId == null) {
      issue.value = null
      error.value = ''
      return
    }

    let active = true
    let requestController = null

    async function loadIssue(showLoader = false) {
      requestController?.abort()
      requestController = new AbortController()
      if (showLoader) loading.value = true

      try {
        const result = await issueApi.getById(issueId, {
          signal: requestController.signal,
        })
        if (active) {
          issue.value = result
          error.value = ''
        }
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') {
          error.value = requestError.message
        }
      } finally {
        if (active && showLoader) loading.value = false
      }
    }

    loadIssue(true)
    const intervalId = setInterval(() => loadIssue(false), 30_000)

    onCleanup(() => {
      active = false
    })
  },
  { immediate: true },
)
</script>

<template>
  <aside v-if="issueId == null" class="panel details-panel empty-details">
    <span class="details-placeholder-icon">#</span>
    <h2>Izaberite prijavu</h2>
    <p>Detalji izabrane prijave biće prikazani na ovom mestu.</p>
  </aside>

  <aside
    v-else-if="loading && !issue"
    class="panel details-panel details-loading"
    aria-label="Učitavanje detalja"
  >
    <LoaderCircle class="spin" :size="26" />
    <span>Učitavanje detalja…</span>
  </aside>

  <aside v-else-if="error && !issue" class="panel details-panel empty-details">
    <h2>Detalji nisu dostupni</h2>
    <p>{{ error }}</p>
  </aside>

  <aside v-else-if="issue" class="panel details-panel">
    <div class="details-title-row">
      <div>
        <p class="eyebrow">Prijava #{{ issue.id }}</p>
        <h2>{{ issue.title }}</h2>
      </div>
      <span class="badge" :class="`priority-${issue.priority}`">
        {{ PRIORITY_LABELS[issue.priority] }}
      </span>
    </div>

    <p v-if="error" class="inline-warning">Automatsko osvežavanje nije uspelo.</p>
    <p class="issue-description">{{ issue.description }}</p>

    <dl class="details-list">
      <div>
        <dt><UserRound :size="16" /> Odgovorna osoba</dt>
        <dd>{{ issue.owner }}</dd>
      </div>
      <div>
        <dt><CalendarClock :size="16" /> Poslednja izmena</dt>
        <dd>{{ formatIssueDate(issue.updatedAt) }}</dd>
      </div>
      <div>
        <dt><RefreshCw :size="16" /> Automatsko osvežavanje</dt>
        <dd>Na svakih 30 sekundi</dd>
      </div>
    </dl>

    <label class="status-control">
      <span>Status prijave</span>
      <select :value="issue.status" @change="$emit('status-change', issue.id, $event.target.value)">
        <option v-for="(label, value) in STATUS_LABELS" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </label>

    <button class="button button-danger" type="button" @click="$emit('delete', issue.id)">
      <Trash2 :size="17" />
      Obriši prijavu
    </button>
  </aside>
</template>
