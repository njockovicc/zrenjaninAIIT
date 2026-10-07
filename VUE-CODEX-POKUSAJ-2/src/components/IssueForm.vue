<script setup>
import { reactive, ref } from 'vue'
import { LoaderCircle, Save } from '@lucide/vue'

defineProps({
  submitting: { type: Boolean, required: true },
})

const emit = defineEmits(['submit', 'cancel'])

const initialForm = () => ({
  title: '',
  description: '',
  priority: 'medium',
  owner: '',
})

const form = reactive(initialForm())
const validationError = ref('')

function updateField(field, value) {
  form[field] = value
  if (validationError.value) validationError.value = ''
}

async function handleSubmit() {
  if (!form.title.trim() || !form.description.trim()) {
    validationError.value = 'Naslov i opis prijave su obavezni.'
    return
  }

  const wasCreated = await new Promise((resolve) => {
    emit('submit', { ...form }, resolve)
  })

  if (wasCreated) Object.assign(form, initialForm())
}
</script>

<template>
  <section class="panel issue-form-panel">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Nova prijava</p>
        <h2>Prijavite problem</h2>
      </div>
      <button class="button button-ghost" type="button" @click="$emit('cancel')">Otkaži</button>
    </div>

    <form class="issue-form" novalidate @submit.prevent="handleSubmit">
      <label class="full-width">
        <span>Naslov *</span>
        <input
          type="text"
          :value="form.title"
          maxlength="100"
          placeholder="Kratak opis problema"
          @input="updateField('title', $event.target.value)"
        />
      </label>

      <label class="full-width">
        <span>Opis *</span>
        <textarea
          :value="form.description"
          rows="4"
          maxlength="600"
          placeholder="Opišite uočeno ponašanje…"
          @input="updateField('description', $event.target.value)"
        />
      </label>

      <label>
        <span>Prioritet</span>
        <select :value="form.priority" @change="updateField('priority', $event.target.value)">
          <option value="low">Nizak</option>
          <option value="medium">Srednji</option>
          <option value="high">Visok</option>
        </select>
      </label>

      <label>
        <span>Odgovorna osoba</span>
        <input
          type="text"
          :value="form.owner"
          maxlength="50"
          placeholder="Npr. Ana"
          @input="updateField('owner', $event.target.value)"
        />
      </label>

      <p v-if="validationError" class="form-error full-width" role="alert">
        {{ validationError }}
      </p>

      <div class="form-actions full-width">
        <button class="button button-primary" type="submit" :disabled="submitting">
          <LoaderCircle v-if="submitting" class="spin" :size="18" />
          <Save v-else :size="18" />
          {{ submitting ? 'Čuvanje…' : 'Sačuvaj prijavu' }}
        </button>
      </div>
    </form>
  </section>
</template>
