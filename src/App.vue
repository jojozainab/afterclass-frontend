<script setup>
import { computed, onMounted, ref } from 'vue'
import LessonCard from './components/LessonCard.vue'
import SortControls from './components/SortControls.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import { getLessons } from './services/api'
import './catalogue.css'

const lessons = ref([])
const loading = ref(true)
const error = ref('')
const sortAttribute = ref('topic')
const sortDirection = ref('asc')
const cart = ref([])
const showCart = ref(false)
const cartMessage = ref('')
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const cartItems = computed(() => cart.value.map((item) => ({
  lesson: lessons.value.find((lesson) => lesson._id === item.lessonId),
  quantity: item.quantity,
})))
const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.lesson.price * item.quantity, 0))
const sortedLessons = computed(() => [...lessons.value].sort((a, b) => {
  const key = sortAttribute.value
  const result = ['price', 'space'].includes(key)
    ? a[key] - b[key]
    : a[key].localeCompare(b[key], 'en', { sensitivity: 'base' })
  return (sortDirection.value === 'asc' ? 1 : -1) * result
}))

function addToCart(lessonId) {
  const lesson = lessons.value.find((item) => item._id === lessonId)
  if (!lesson || lesson.space <= 0) return
  const item = cart.value.find((item) => item.lessonId === lessonId)
  if (item) item.quantity++
  else cart.value.push({ lessonId, quantity: 1 })
  lesson.space--
  cartMessage.value = `Added one ${lesson.topic} space. ${cartCount.value} spaces in your cart.`
}

function removeFromCart(lessonId) {
  const index = cart.value.findIndex((item) => item.lessonId === lessonId)
  const lesson = lessons.value.find((item) => item._id === lessonId)
  if (index < 0 || !lesson) return
  cart.value[index].quantity--
  if (cart.value[index].quantity === 0) cart.value.splice(index, 1)
  lesson.space++
  cartMessage.value = `Removed one ${lesson.topic} space. ${cartCount.value} spaces in your cart.`
}

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
    <button type="button" :disabled="!showCart && cartCount === 0" :aria-expanded="showCart"
      v-on:click="showCart = !showCart">
      {{ showCart ? 'Back to lessons' : `Shopping cart (${cartCount})` }}
    </button>
  </header>
  <main>
    <section class="intro" aria-labelledby="page-title">
      <p class="eyebrow">AFTER SCHOOL, MORE POSSIBILITIES</p>
      <h1 id="page-title">Find their next<br /><span>favourite thing.</span></h1>
      <p>From creative minds to future scientists, discover classes that make learning something to look forward to.</p>
    </section>
    <p class="cart-message" role="status">{{ cartMessage }}</p>
    <ShoppingCart v-if="showCart" :items="cartItems" :total="cartTotal" v-on:remove="removeFromCart" />
    <section v-else aria-labelledby="catalogue-title" :aria-busy="loading">
      <div class="catalogue-heading">
        <h2 id="catalogue-title">Explore our lessons</h2>
        <span v-if="!loading && !error">{{ lessons.length }} lessons to discover</span>
      </div>
      <SortControls v-model:attribute="sortAttribute" v-model:direction="sortDirection" />
      <p v-if="loading" class="status-panel" role="status">Loading lessons…</p>
      <div v-else-if="error" class="status-panel error-panel" role="alert">
        <p>{{ error }}</p>
        <button type="button" v-on:click="loadLessons">Try again</button>
      </div>
      <p v-else-if="lessons.length === 0" class="status-panel">No lessons are available right now. Please check back soon.</p>
      <div v-else class="lesson-grid">
        <LessonCard v-for="lesson in sortedLessons" :key="lesson._id" :lesson="lesson" v-on:add="addToCart" />
      </div>
    </section>
  </main>
  <footer>AfterClass · Make room for something new.</footer>
</template>
