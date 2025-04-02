<template>
  <ScrollRect class="long-content" scroll="both">
    <h1>Long content that can scroll</h1>
    <p>
      Hello. 
      This is a simple scroll rect component for Vue3.
      You can wrap your long content with this component. 
      So it can scroll.
    </p>  
    <p>It is easy to use!</p>
    <p>
      It provides a simple scrollbar that can fade out and help you unify the display style of each browser.
    </p>
    <p>It is easy to use!</p>
  </ScrollRect>
</template>

<script setup lang="ts">
import ScrollRect from '../../src/ScrollRect.vue';
</script>

<style lang="scss">
.long-content {
  padding: 20px;
}
</style>
