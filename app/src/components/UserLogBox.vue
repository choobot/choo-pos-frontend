<template>
  <tr>
    <td class="user-log-time">{{ dateFormat(user_log.time) }}</td>
    <td>
      <span class="user-log-picture"
        ><img v-bind:src="user_log.user.picture" class="avartar img-circle"
      /></span>
      <span class="user-log-name">{{ user_log.user.name }}</span>
    </td>
  </tr>
</template>

<script>
export default {
  props: ["user_log"],
};
</script>
