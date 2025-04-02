<script setup lang="ts">
import IndexImage from '../../index/IndexImage.vue'
import DefaultTheme from 'vitepress/theme';
const DefaultLayout = DefaultTheme.Layout;
</script>

<template>
  <DefaultLayout>
    <template #home-hero-image>
      <IndexImage />
    </template>
  </DefaultLayout>
</template>