<template>
  <tr>
    <td class="order-item-index text-left">{{ index + 1 }}</td>
    <td class="order-item-title text-left">{{ item.product.title }}</td>
    <td class="order-item-price text-right">{{ thb(item.product.price) }}</td>
    <td class="order-item-discount text-right text-red">
      {{ thb(item.price - item.product.price) }}
    </td>
    <td class="order-item-discount-price text-right">{{ thb(item.price) }}</td>
  </tr>
</template>

<script>
export default {
  props: ["item", "index"],
};
</script>
