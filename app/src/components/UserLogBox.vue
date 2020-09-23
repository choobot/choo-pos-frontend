<template>
  <tr>
    <td>{{ dateFormat(user_log.time) }}</td>
    <td>
      <img v-bind:src="user_log.user.picture" class="avartar img-circle" />
      {{ user_log.user.name }}
    </td>
  </tr>
</template>

<script>
export default {
  props: ["user_log"],
};
</script>
