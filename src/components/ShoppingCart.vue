<script setup>
defineProps({ items: { type: Array, required: true }, total: { type: Number, required: true } })
defineEmits(['remove'])
const money = (value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
</script>

<template>
  <section aria-labelledby="cart-title">
    <div class="catalogue-heading"><h2 id="cart-title">Your shopping cart</h2></div>
    <p v-if="items.length === 0" class="status-panel">Your cart is empty. Back to lessons to discover something new.</p>
    <ul v-else class="cart-list">
      <li v-for="item in items" :key="item.lesson._id" class="cart-row">
        <div><h3>{{ item.lesson.topic }}</h3><p>{{ item.lesson.location }} · {{ money(item.lesson.price) }} per space</p></div>
        <div><p>Quantity: {{ item.quantity }}</p><strong>{{ money(item.lesson.price * item.quantity) }}</strong></div>
        <button type="button" :aria-label="`Remove one ${item.lesson.topic} space`" v-on:click="$emit('remove', item.lesson._id)">Remove one</button>
      </li>
    </ul>
    <p v-if="items.length" class="cart-total">Total <strong>{{ money(total) }}</strong></p>
  </section>
</template>
