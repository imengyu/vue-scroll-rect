---
title: Install
---

# Install

```shell
npm install -save @imengyu/vue-scroll-rect
```

## Global Import

```js
//main.js
import '@imengyu/vue-scroll-rect/lib/vue-scroll-rect.css'
import ScrollRect from '@imengyu/vue-scroll-rect'

createApp(App)
  .use(ScrollRect)
  .mount('#app')  
```

Use: 

```html
<scroll-rect>
  <div>
    This is the content that needs to be scrolled
  </div>
</scroll-rect>
```

## Local Registration

First import the style file:

```js
//main.js
import '@imengyu/vue-scroll-rect/lib/vue-scroll-rect.css'
```

Then import components where you need to use them:

```vue
<template>
  <scroll-rect>
    <div>
      This is the content that needs to be scrolled
    </div>
  </scroll-rect>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// Import components
import { ScrollRect } from '@imengyu/vue-scroll-rect';

//If not use setup:
export default defineComponent({
  //Register components
  components: {
    ScrollRect,
  },
});
</script>
```

## Usage

[Usage](./useage.md)
