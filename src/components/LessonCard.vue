<script setup>
import { ref, watch } from 'vue'
import { API_BASE_URL } from '../services/api'
const props = defineProps({ lesson: { type: Object, required: true } })
defineEmits(['add'])
const imageFailed = ref(false)
const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
watch(() => props.lesson.image, () => { imageFailed.value = false })
</script>

<template>
  <article class="lesson-card">
    <img v-if="lesson.image && !imageFailed" :src="`${API_BASE_URL}${lesson.image}`"
      :alt="`${lesson.topic} lesson`" width="800" height="480" loading="lazy"
      v-on:error="imageFailed = true" />
    <div v-else class="image-fallback">{{ lesson.topic }}</div>
    <div class="lesson-details">
      <p class="location">{{ lesson.location }}</p>
      <h3>{{ lesson.topic }}</h3>
      <dl>
        <div><dt>Price per space</dt><dd>{{ currency.format(lesson.price) }}</dd></div>
        <div><dt>Spaces available</dt><dd>{{ lesson.space }}</dd></div>
      </dl>
      <button class="add-button" type="button" :disabled="lesson.space <= 0"
        :aria-label="`Add one ${lesson.topic} space to cart`" v-on:click="$emit('add', lesson._id)">
        {{ lesson.space > 0 ? 'Add to Cart' : 'Sold out' }}
      </button>
    </div>
  </article>
</template>
