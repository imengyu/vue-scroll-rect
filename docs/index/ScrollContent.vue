<template>
  <div class="test-scroll-content">
    <h1>{{ title }}</h1>
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
    <h2>Long content that can scroll</h2>
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps({	
  title : {
    type : String,
    default : 'Long content that can scroll'
  }	
})
</script>

<style lang="scss">
.test-scroll-content {
  min-width: 500px;
}
</style>
