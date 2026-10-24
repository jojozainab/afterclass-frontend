<script setup>
import { onMounted, ref } from 'vue'
import LessonCard from './components/LessonCard.vue'
import { getLessons } from './services/api'
import './catalogue.css'

const lessons = ref([])
const loading = ref(true)
const error = ref('')

function loadLessons() {
  loading.value = true
  error.value = ''
  return getLessons()
    .then((data) => { lessons.value = data })
    .catch((problem) => {
      error.value = problem instanceof TypeError
        ? 'We could not connect to the lesson service. Please try again.'
        : problem.message
    })
    .finally(() => { loading.value = false })
}

onMounted(loadLessons)
</script>

<template>
  <header class="site-header">
    <a class="brand" href="./" aria-label="AfterClass home">After<span>Class</span>.</a>
    <span class="header-note">A little curiosity goes a long way.</span>
  </header>
  <main>
    <section class="intro" aria-labelledby="page-title">
      <p class="eyebrow">AFTER SCHOOL, MORE POSSIBILITIES</p>
      <h1 id="page-title">Find their next<br /><span>favourite thing.</span></h1>
      <p>From creative minds to future scientists, discover classes that make learning something to look forward to.</p>
    </section>
    <section aria-labelledby="catalogue-title" :aria-busy="loading">
      <div class="catalogue-heading">
        <h2 id="catalogue-title">Explore our lessons</h2>
        <span v-if="!loading && !error">{{ lessons.length }} lessons to discover</span>
      </div>
      <p v-if="loading" class="status-panel" role="status">Loading lessons…</p>
      <div v-else-if="error" class="status-panel error-panel" role="alert">
        <p>{{ error }}</p>
        <button type="button" v-on:click="loadLessons">Try again</button>
      </div>
      <p v-else-if="lessons.length === 0" class="status-panel">No lessons are available right now. Please check back soon.</p>
      <div v-else class="lesson-grid">
        <LessonCard v-for="lesson in lessons" :key="lesson._id" :lesson="lesson" />
      </div>
    </section>
  </main>
  <footer>AfterClass · Make room for something new.</footer>
</template>
