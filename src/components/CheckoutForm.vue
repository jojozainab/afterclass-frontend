<script setup>
import { computed, ref } from "vue";
const props = defineProps({
  busy: Boolean,
  locked: Boolean,
  empty: Boolean,
  pending: Boolean,
  message: String,
  failed: Boolean,
});
const emit = defineEmits(["checkout", "retry"]);
const name = ref("");
const phone = ref("");
const validName = computed(() => /^[A-Za-z]+$/.test(name.value.trim()));
const validPhone = computed(() => /^[0-9]+$/.test(phone.value.trim()));
const disabledReason = computed(() => {
  if (props.busy) return "Your booking is being submitted.";
  if (props.locked)
    return "Please resolve the booking message below before submitting again.";
  if (props.empty) return "Add at least one lesson to your cart to check out.";
  if (!validName.value) return "Enter a name using letters only.";
  if (!validPhone.value) return "Enter a phone number using digits only.";
  return "";
});
function submit() {
  if (
    props.busy ||
    props.locked ||
    props.empty ||
    !validName.value ||
    !validPhone.value
  )
    return;
  emit("checkout", { name: name.value.trim(), phone: phone.value.trim() });
}
</script>

<template>
  <form class="checkout-panel" novalidate v-on:submit.prevent="submit">
    <h3>Checkout</h3>
    <label for="customer-name">Name</label>
    <input
      id="customer-name"
      v-model="name"
      type="text"
      autocomplete="given-name"
      :disabled="busy || locked"
      aria-describedby="name-help"
      :aria-invalid="name.length > 0 && !validName"
    />
    <small id="name-help">Letters only, without spaces or punctuation.</small>
    <label for="customer-phone">Phone</label>
    <input
      id="customer-phone"
      v-model="phone"
      type="tel"
      inputmode="numeric"
      autocomplete="tel"
      :disabled="busy || locked"
      aria-describedby="phone-help"
      :aria-invalid="phone.length > 0 && !validPhone"
    />
    <small id="phone-help">Numbers only, including any leading zero.</small>
    <p v-if="disabledReason" id="checkout-help" role="status">
      {{ disabledReason }}
    </p>
    <button
      type="submit"
      :disabled="!!disabledReason"
      :aria-describedby="disabledReason ? 'checkout-help' : undefined"
    >
      {{ busy ? "Submitting…" : "Checkout" }}
    </button>
    <button
      v-if="pending"
      type="button"
      :disabled="busy"
      v-on:click="$emit('retry')"
    >
      Complete booking
    </button>
    <p v-if="message" :role="failed ? 'alert' : 'status'">{{ message }}</p>
  </form>
</template>
