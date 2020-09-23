<template>
  <tr>
    <td class="text-left">{{ index + 1 }}</td>
    <td class="product-cover text-center">
      <img v-bind:src="item.product.cover" />
    </td>
    <td class="text-left">{{ item.product.title }}</td>
    <td class="text-right">
      <span v-if="item.price != item.product.price">
        <span class="text-strikethrough">{{ thb(item.product.price) }}</span>
        <span class="text-red">{{ thb(item.price) }}</span>
      </span>
      <span v-else>
        {{ thb(item.price) }}
      </span>
    </td>
    <td class="text-right">
      <button
        @click="$emit('remove-from-cart', index)"
        class="btn btn-sm btn-danger"
      >
        X
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  props: ["item", "index"],
};
</script>
