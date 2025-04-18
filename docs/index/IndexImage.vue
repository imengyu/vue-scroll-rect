<template>
  <ScrollRect class="index-code-box" scroll="both">
    <highlightjs :autodetect="true" :code="IndexDemo"></highlightjs>
  </ScrollRect>
</template>

<script setup lang="ts">
import ScrollRect from '../../src/ScrollRect.vue';
import IndexDemo from './IndexDemo.vue?raw';
</script>

<style lang="scss">
.index-code-box {
  height: 400px;
  width: 550px;
  background: #1f1f1f; 
  border-radius: 10px;
  margin-left: 50px;
  overflow: hidden;
  text-align: left;

  pre {
    margin-bottom: 0;

    code.hljs {
      width: max-content;
      overflow: initial;
    }
  }
}

@media (max-width: 960px) {
  .index-code-box {
    margin-top: 40px;
    width: 600px;
    height: 300px;
    margin-left: 0;
    transform: translateX(-80px);
  }
}
@media (max-width: 760px) {
  .index-code-box {
    margin-top: 20px;
    width: 100%;
    height: 250px;
    transform: none;
  }
}
</style>
