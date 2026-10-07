<script setup>
import { Bug, Plus, X } from '@lucide/vue'

defineProps({
  formOpen: { type: Boolean, required: true },
})

defineEmits(['toggle-form'])
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <a class="brand" href="#top" aria-label="IssueDesk početna strana">
        <span class="brand-icon" aria-hidden="true">
          <Bug :size="21" :stroke-width="2.2" />
        </span>
        <span>IssueDesk</span>
      </a>

      <button class="button button-primary" type="button" @click="$emit('toggle-form')">
        <X v-if="formOpen" :size="18" />
        <Plus v-else :size="18" />
        {{ formOpen ? 'Zatvori formu' : 'Nova prijava' }}
      </button>
    </div>
  </header>
</template>
