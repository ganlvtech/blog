<template>
    <div id="app">
        <h1>Hello, world!</h1>
        <my-component />
        <my-component msg="A message" />
    </div>
</template>

<script>
import MyComponent from "./components/MyComponent.vue";

export default {
  components: {
    "my-component": MyComponent
  }
};
</script>

