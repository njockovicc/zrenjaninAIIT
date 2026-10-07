<script setup>
import { ChevronRight, Inbox } from '@lucide/vue'
import { PRIORITY_LABELS, STATUS_LABELS, formatIssueDate } from '../lib/issueUtils.js'

defineProps({
  issues: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  selectedId: { type: Number, default: null },
})

defineEmits(['select'])
</script>

<template>
  <section class="panel issue-list-panel" :aria-busy="loading">
    <div class="section-heading compact">
      <div>
        <p class="eyebrow">Rezultati</p>
        <h2>Prijave</h2>
      </div>
      <span class="result-count">{{ issues.length }}</span>
    </div>

    <div v-if="loading" class="loading-list" aria-label="Učitavanje prijava">
      <div v-for="item in [1, 2, 3]" :key="item" class="skeleton-row" />
    </div>

    <div v-else-if="issues.length === 0" class="empty-state">
      <Inbox :size="34" aria-hidden="true" />
      <h3>Nema pronađenih prijava</h3>
      <p>Promenite kriterijume pretrage ili dodajte novu prijavu.</p>
    </div>

    <div v-else class="issue-list">
      <button
        v-for="issue in issues"
        :key="issue.id"
        class="issue-row"
        :class="{ selected: selectedId === issue.id }"
        type="button"
        @click="$emit('select', issue.id)"
      >
        <span class="issue-row-main">
          <span class="issue-number">#{{ issue.id }}</span>
          <strong>{{ issue.title }}</strong>
          <span class="issue-meta">
            {{ issue.owner }} · {{ formatIssueDate(issue.updatedAt) }}
          </span>
        </span>
        <span class="issue-row-badges">
          <span class="badge" :class="`priority-${issue.priority}`">
            {{ PRIORITY_LABELS[issue.priority] }}
          </span>
          <span class="badge" :class="`status-${issue.status}`">
            {{ STATUS_LABELS[issue.status] }}
          </span>
        </span>
        <ChevronRight class="row-chevron" :size="18" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>
