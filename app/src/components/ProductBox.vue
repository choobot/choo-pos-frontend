<template>
  <div class="product-box panel panel-default">
    <div class="panel-body">
      <div class="product-cover"><img v-bind:src="product.cover" /></div>
      <div class="product-title text-left">{{ product.title }}</div>
      <div class="product-price text-left">{{ thb(product.price) }}</div>
    </div>
    <div class="product-add-cart panel-footer text-center">
      <button @click="$emit('add-to-cart', product.id)" class="btn btn-success">
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductBox",
  props: ["product"],
};
</script>
