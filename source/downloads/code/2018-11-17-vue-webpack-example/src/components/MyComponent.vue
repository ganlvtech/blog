<template>
    <div>
        <h2>My component</h2>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
export default {
  props: {
    msg: {
      default: "default message",
      type: String
    }
  }
};
</script>

