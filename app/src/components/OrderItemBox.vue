<template>
  <tr>
    <td class="text-left">{{ index + 1 }}</td>
    <td class="text-left">{{ item.product.title }}</td>
    <td class="text-right">{{ thb(item.product.price) }}</td>
    <td class="text-right text-red">
      {{ thb(item.price - item.product.price) }}
    </td>
    <td class="text-right">{{ thb(item.price) }}</td>
  </tr>
</template>

<script>
export default {
  props: ["item", "index"],
};
</script>
