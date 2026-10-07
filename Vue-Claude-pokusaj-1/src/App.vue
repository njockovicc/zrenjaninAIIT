<script setup>
import { ref, shallowRef, watch } from 'vue'
import { AlertTriangle, RotateCcw } from '@lucide/vue'
import AppHeader from './components/AppHeader.vue'
import IssueDetails from './components/IssueDetails.vue'
import IssueFilters from './components/IssueFilters.vue'
import IssueForm from './components/IssueForm.vue'
import IssueList from './components/IssueList.vue'
import IssueStats from './components/IssueStats.vue'
import { issueApi } from './services/fakeApi.js'

const EMPTY_STATS = { total: 0, open: 0, inProgress: 0, closed: 0 }

const issues = shallowRef([])
const stats = ref(EMPTY_STATS)
const query = ref('')
const status = ref('all')
const priority = ref('all')
const selectedId = ref(null)
const formOpen = ref(false)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const refreshToken = ref(0)
const searchQuery = ref('')

let hasInitializedSelection = false
let hasLoadedStats = false

watch(
  [searchQuery, status, priority, refreshToken],
  async () => {
    loading.value = true
    try {
      const result = await issueApi.list({
        query: searchQuery.value,
        status: status.value,
        priority: priority.value,
      })
      issues.value = result.items
      if (!hasLoadedStats) {
        stats.value = result.stats
        hasLoadedStats = true
      }

      if (!hasInitializedSelection && result.items.length > 0) {
        selectedId.value = result.items[0].id
        hasInitializedSelection = true
      }
    } catch (requestError) {
      error.value = requestError.message
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

function handleFilterChange(field, value) {
  if (field === 'query') {
    searchQuery.value = query.value
    query.value = value
  }
  if (field === 'status') status.value = value
  if (field === 'priority') priority.value = value
}

function refreshData() {
  refreshToken.value += 1
}

async function handleCreate(input, resolve) {
  submitting.value = true
  try {
    const createdIssue = await issueApi.create(input)
    error.value = ''
    selectedId.value = createdIssue.id
    hasInitializedSelection = true
    formOpen.value = false
    refreshData()
    resolve(true)
  } catch (requestError) {
    error.value = requestError.message
    resolve(false)
  } finally {
    submitting.value = false
  }
}

async function handleStatusChange(id, nextStatus) {
  try {
    await issueApi.update(id, { status: nextStatus })
    const changedIssue = issues.value.find((issue) => issue.id === id)
    if (changedIssue) changedIssue.status = nextStatus
    issues.value = issues.value
    error.value = ''
  } catch (requestError) {
    error.value = requestError.message
  }
}

async function handleDelete(id) {
  try {
    const visibleIndex = issues.value.findIndex((issue) => issue.id === id)
    await issueApi.removeAt(visibleIndex)
    error.value = ''
    refreshData()
  } catch (requestError) {
    error.value = requestError.message
  }
}

function handleSelect(id) {
  hasInitializedSelection = true
  selectedId.value = id
}
</script>

<template>
  <div id="top" class="app-shell">
    <AppHeader :form-open="formOpen" @toggle-form="formOpen = !formOpen" />

    <main class="page-content">
      <section class="page-intro">
        <div>
          <p class="eyebrow">Kontrolna tabla</p>
          <h1>Upravljanje prijavljenim problemima</h1>
          <p>Pratite, filtrirajte i ažurirajte prijave na jednom mestu.</p>
        </div>
        <span class="reference-label">Pregled prijava</span>
      </section>

      <IssueStats :stats="stats" />

      <IssueForm
        v-if="formOpen"
        :submitting="submitting"
        @submit="handleCreate"
        @cancel="formOpen = false"
      />

      <IssueFilters
        :query="query"
        :status="status"
        :priority="priority"
        @change="handleFilterChange"
      />

      <div v-if="error" class="error-banner" role="alert">
        <AlertTriangle :size="19" />
        <span>{{ error }}</span>
        <button class="button button-ghost" type="button" @click="refreshData">
          <RotateCcw :size="16" />
          Pokušaj ponovo
        </button>
      </div>

      <div class="workspace-grid">
        <IssueList
          :issues="issues"
          :loading="loading"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <IssueDetails
          :issue-id="selectedId"
          :refresh-token="refreshToken"
          @status-change="handleStatusChange"
          @delete="handleDelete"
        />
      </div>
    </main>

    <footer>IssueDesk · Eksperimentalna Vue/Vite aplikacija</footer>
  </div>
</template>
