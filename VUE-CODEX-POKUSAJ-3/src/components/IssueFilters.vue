<script setup>
import { Search } from '@lucide/vue'

defineProps({
  query: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
})

defineEmits(['change'])
</script>

<template>
  <section class="filters" aria-label="Pretraga i filtriranje prijava">
    <label class="search-field">
      <span class="sr-only">Pretraži prijave</span>
      <Search :size="18" aria-hidden="true" />
      <input
        type="search"
        :value="query"
        placeholder="Pretraži po naslovu, opisu ili odgovornoj osobi…"
        @input="$emit('change', 'query', $event.target.value)"
      />
    </label>

    <label>
      <span>Status</span>
      <select :value="status" @change="$emit('change', 'status', $event.target.value)">
        <option value="all">Svi statusi</option>
        <option value="open">Otvoreno</option>
        <option value="in-progress">U obradi</option>
        <option value="closed">Zatvoreno</option>
      </select>
    </label>

    <label>
      <span>Prioritet</span>
      <select :value="priority" @change="$emit('change', 'priority', $event.target.value)">
        <option value="all">Svi prioriteti</option>
        <option value="high">Visok</option>
        <option value="medium">Srednji</option>
        <option value="low">Nizak</option>
      </select>
    </label>
  </section>
</template>
