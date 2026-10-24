<script setup>
import { computed, onMounted, ref } from 'vue'
import LessonCard from './components/LessonCard.vue'
import SortControls from './components/SortControls.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import CheckoutForm from './components/CheckoutForm.vue'
import { getLessons, createOrder, updateLesson, searchLessons } from './services/api'
import './catalogue.css'

const lessons = ref([])
const loading = ref(true)
const error = ref('')
const searchText = ref('')
const searchResults = ref(null)
const searching = ref(false)
const searchError = ref('')
let searchRequest = 0
const visibleLessons = computed(() => searchResults.value === null ? lessons.value
  : searchResults.value.map((result) => lessons.value.find((lesson) => lesson._id === result._id) || result))

async function runSearch() {
  const request = ++searchRequest
  searching.value = true
  searchError.value = ''
  try {
    const results = await searchLessons(searchText.value.trim())
    if (request !== searchRequest) return
    // Keep master lessons intact so search preserves cart availability.
    for (const result of results) {
      if (!lessons.value.some((lesson) => lesson._id === result._id)) lessons.value.push(result)
    }
    searchResults.value = results
  } catch (problem) {
    if (request === searchRequest) searchError.value = problem instanceof TypeError
      ? 'Unable to connect to search. Please try again.' : problem.message
  } finally {
    if (request === searchRequest) searching.value = false
  }
}

function clearSearch() {
  searchText.value = ''
  runSearch()
}
const sortAttribute = ref('topic')
const sortDirection = ref('asc')
const cart = ref([])
const showCart = ref(false)
const cartMessage = ref('')
const checkoutBusy = ref(false)
const checkoutMessage = ref('')
const checkoutFailed = ref(false)
const pendingOrder = ref(null)
const uncertainOrder = ref(false)
const cartLocked = computed(() => checkoutBusy.value || !!pendingOrder.value || uncertainOrder.value)
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const cartItems = computed(() => cart.value.map((item) => ({
  lesson: lessons.value.find((lesson) => lesson._id === item.lessonId),
  quantity: item.quantity,
})))
const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.lesson.price * item.quantity, 0))
const sortedLessons = computed(() => [...visibleLessons.value].sort((a, b) => {
  const key = sortAttribute.value
  const result = ['price', 'space'].includes(key)
    ? a[key] - b[key]
    : a[key].localeCompare(b[key], 'en', { sensitivity: 'base' })
  return (sortDirection.value === 'asc' ? 1 : -1) * result
}))

function addToCart(lessonId) {
  if (cartLocked.value) return
  checkoutMessage.value = ''
  const lesson = lessons.value.find((item) => item._id === lessonId)
  if (!lesson || lesson.space <= 0) return
  const item = cart.value.find((item) => item.lessonId === lessonId)
  if (item) item.quantity++
  else cart.value.push({ lessonId, quantity: 1 })
  lesson.space--
  cartMessage.value = `Added one ${lesson.topic} space. ${cartCount.value} spaces in your cart.`
}

function removeFromCart(lessonId) {
  if (cartLocked.value) return
  const index = cart.value.findIndex((item) => item.lessonId === lessonId)
  const lesson = lessons.value.find((item) => item._id === lessonId)
  if (index < 0 || !lesson) return
  cart.value[index].quantity--
  if (cart.value[index].quantity === 0) cart.value.splice(index, 1)
  lesson.space++
  cartMessage.value = `Removed one ${lesson.topic} space. ${cartCount.value} spaces in your cart.`
}

async function finishBooking() {
  // Remove each successful PUT from the retry queue. No second POST is sent.
  while (pendingOrder.value.updates.length) {
    const update = pendingOrder.value.updates[0]
    await updateLesson(update.lessonId, { space: update.space })
    const lesson = lessons.value.find((item) => item._id === update.lessonId)
    lesson.space = update.space
    pendingOrder.value.updates.shift()
  }
  const orderId = pendingOrder.value.orderId
  pendingOrder.value = null
  cart.value = []
  cartMessage.value = ''
  checkoutFailed.value = false
  checkoutMessage.value = `Your order has been submitted successfully. Reference: ${orderId}`
}

async function checkout(customer) {
  if (cartLocked.value || cartCount.value === 0) return
  if (!/^[A-Za-z]+$/.test(customer.name) || !/^[0-9]+$/.test(customer.phone)) return
  checkoutBusy.value = true
  checkoutFailed.value = false
  checkoutMessage.value = ''
  let posting = false
  try {
    const latest = await getLessons()
    const updates = cart.value.map((item) => {
      const lesson = latest.find((lesson) => lesson._id === item.lessonId)
      if (!lesson || lesson.space < item.quantity) throw new Error('A selected lesson no longer has enough spaces. Please adjust your cart.')
      return { lessonId: item.lessonId, space: lesson.space - item.quantity }
    })
    posting = true
    const result = await createOrder({ ...customer, items: cart.value.map((item) => ({ ...item })) })
    posting = false
    pendingOrder.value = { orderId: result.orderId, updates }
    await finishBooking()
  } catch (problem) {
    checkoutFailed.value = true
    if (pendingOrder.value) {
      checkoutMessage.value = `Order ${pendingOrder.value.orderId} was saved, but booking confirmation is incomplete. Please keep this page open and choose Complete booking.`
    } else if (posting && (!problem.status || problem.status >= 500)) {
      uncertainOrder.value = true
      checkoutMessage.value = 'We could not confirm whether your order was saved. Please check before submitting again.'
    } else {
      checkoutMessage.value = problem instanceof TypeError ? 'Unable to connect. Please try again.' : problem.message
    }
  } finally {
    checkoutBusy.value = false
  }
}

async function retryBooking() {
  if (checkoutBusy.value || !pendingOrder.value) return
  checkoutBusy.value = true
  try {
    await finishBooking()
  } catch {
    checkoutFailed.value = true
    checkoutMessage.value = 'Your order is saved, but confirmation is still incomplete. Keep this page open and try Complete booking again.'
  } finally {
    checkoutBusy.value = false
  }
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
    <a class="brand" href="./" aria-label="AfterClass home" v-on:click.prevent="!cartLocked && (showCart = false)">After<span>Class</span>.</a>
    <span class="header-note">A little curiosity goes a long way.</span>
    <button type="button" :disabled="cartLocked || (!showCart && cartCount === 0)" :aria-expanded="showCart"
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
    <ShoppingCart v-if="showCart" :items="cartItems" :total="cartTotal" :locked="cartLocked" v-on:remove="removeFromCart">
      <CheckoutForm :busy="checkoutBusy" :locked="cartLocked" :empty="cartCount === 0" :pending="!!pendingOrder"
        :message="checkoutMessage" :failed="checkoutFailed" v-on:checkout="checkout" v-on:retry="retryBooking" />
    </ShoppingCart>
    <section v-else aria-labelledby="catalogue-title" :aria-busy="loading">
      <div class="catalogue-heading">
        <h2 id="catalogue-title">Explore our lessons</h2>
        <span v-if="!loading && !error">{{ visibleLessons.length }} lessons to discover</span>
      </div>
      <SortControls v-model:attribute="sortAttribute" v-model:direction="sortDirection" />
      <form class="search-form" role="search" v-on:submit.prevent="runSearch">
        <label for="lesson-search">Find a lesson</label>
        <div class="search-actions">
          <input id="lesson-search" v-model="searchText" type="search" maxlength="100"
            placeholder="Search subject, location, price or spaces" :disabled="loading || !!error" />
          <button type="submit" :disabled="loading || !!error || searching">{{ searching ? 'Searching…' : 'Search' }}</button>
          <button type="button" :disabled="loading || !!error || searching" v-on:click="clearSearch">Clear</button>
        </div>
      </form>
      <p v-if="searching" role="status">Searching lessons…</p>
      <p v-if="searchError" role="alert">{{ searchError }}</p>
      <p v-if="loading" class="status-panel" role="status">Loading lessons…</p>
      <div v-else-if="error" class="status-panel error-panel" role="alert">
        <p>{{ error }}</p>
        <button type="button" v-on:click="loadLessons">Try again</button>
      </div>
      <p v-else-if="visibleLessons.length === 0" class="status-panel">No lessons found. Try another search or clear the search.</p>
      <div v-else class="lesson-grid">
        <LessonCard v-for="lesson in sortedLessons" :key="lesson._id" :lesson="lesson" v-on:add="addToCart" />
      </div>
    </section>
  </main>
  <footer>AfterClass · Make room for something new.</footer>
</template>
