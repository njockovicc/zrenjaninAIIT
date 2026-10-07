<script setup>
import { CheckCircle2, CircleDot, ListChecks, LoaderCircle } from '@lucide/vue'

defineProps({
  stats: { type: Object, required: true },
})

const cards = [
  { key: 'total', label: 'Ukupno', icon: ListChecks, tone: 'neutral' },
  { key: 'open', label: 'Otvoreno', icon: CircleDot, tone: 'blue' },
  { key: 'inProgress', label: 'U obradi', icon: LoaderCircle, tone: 'amber' },
  { key: 'closed', label: 'Zatvoreno', icon: CheckCircle2, tone: 'green' },
]
</script>

<template>
  <section class="stats-grid" aria-label="Sažetak prijava">
    <article
      v-for="card in cards"
      :key="card.key"
      class="stat-card"
      :class="`stat-${card.tone}`"
    >
      <span class="stat-icon" aria-hidden="true">
        <component :is="card.icon" :size="20" />
      </span>
      <div>
        <p>{{ card.label }}</p>
        <strong>{{ stats[card.key] }}</strong>
      </div>
    </article>
  </section>
</template>
