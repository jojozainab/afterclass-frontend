<script setup>
defineProps({ attribute: String, direction: String })
defineEmits(['update:attribute', 'update:direction'])
</script>

<template>
  <div class="sort-controls">
    <label>Sort by
      <select :value="attribute" v-on:change="$emit('update:attribute', $event.target.value)">
        <option value="topic">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="space">Spaces</option>
      </select>
    </label>
    <label>Order
      <select :value="direction" v-on:change="$emit('update:direction', $event.target.value)">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </label>
  </div>
</template>
