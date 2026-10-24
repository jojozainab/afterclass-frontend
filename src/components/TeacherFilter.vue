<script setup>
defineProps({ teachers: Array, modelValue: String, loading: Boolean, error: String })
defineEmits(['update:modelValue', 'retry'])
</script>

<template>
  <div class="teacher-filter">
    <label for="teacher-choice">Learn with a teacher</label>
    <select id="teacher-choice" :value="modelValue" :disabled="loading || !!error"
      v-on:change="$emit('update:modelValue', $event.target.value)">
      <option value="">All teachers</option>
      <option v-for="teacher in teachers" :key="teacher._id" :value="teacher._id">
        {{ teacher.firstName }} {{ teacher.lastName }}
      </option>
    </select>
    <span v-if="loading" role="status">Loading teachers…</span>
    <div v-if="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" v-on:click="$emit('retry')">Retry teachers</button>
    </div>
  </div>
</template>
