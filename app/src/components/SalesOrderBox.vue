<template>
  <tr>
    <td class="sales-order-time">{{ dateFormat(sales_order.created_at) }}</td>
    <td>
      <span class="sales-order-id">{{ sales_order.id }}</span>
    </td>
    <td class="text-right">
      <span class="sales-order-amount">{{ thb(sales_order.total) }}</span>
    </td>
    <td class="text-center">
      <a v-bind:href="getWindow().origin + '/?order='+sales_order.id" target="_blank">Receipt</a>
    </td>
  </tr>
</template>

<script>
export default {
  props: ["sales_order"],
};
</script>
