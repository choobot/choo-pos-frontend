<template>
  <tr>
    <td class="cart-item-index text-left">{{ index + 1 }}</td>
    <td class="cart-item-cover text-center">
      <img v-bind:src="item.product.cover" />
    </td>
    <td class="text-left">
      <span class="cart-item-title">{{ item.product.title }}</span>
      <span class="cart-item-percent-discount text-red">{{
        percentDiscount
      }}</span>
    </td>
    <td class="cart-item-price text-right">
      <span v-if="item.price != item.product.price">
        <span class="cart-item-normal-price text-strikethrough">{{
          thb(item.product.price)
        }}</span>
        <span class="cart-item-discount-price text-red">{{
          thb(item.price)
        }}</span>
      </span>
      <span v-else>
        {{ thb(item.price) }}
      </span>
    </td>
    <td class="remove-from-cart text-right">
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
  computed: {
    percentDiscount: function () {
      if (this.item.product.price != this.item.price) {
        return (
          "-" +
          Math.round(
            ((this.item.product.price - this.item.price) * 100) /
              this.item.product.price
          ) +
          "%"
        );
      }
      return "";
    },
  },
};
</script>
