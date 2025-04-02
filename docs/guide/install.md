---
title: 安装
---

# 安装

```shell
npm install -save @imengyu/vue-scroll-rect
```

## 全局导入组件

```js
//main.js
import '@imengyu/vue-scroll-rect/lib/vue-scroll-rect.css'
import ScrollRect from '@imengyu/vue-scroll-rect'

createApp(App)
  .use(ScrollRect)
  .mount('#app')  
```

使用组件：

```html
<scroll-rect>
  <div>
    这里是需要滚动的内容
  </div>
</scroll-rect>
```

## 局部导入组件

首先导入样式文件：

```js
//main.js
import '@imengyu/vue-scroll-rect/lib/vue-scroll-rect.css'
```

然后在你需要使用的地方导入组件使用：

```vue
<template>
  <scroll-rect>
    <div>
      这里是需要滚动的内容
    </div>
  </scroll-rect>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

//导入组件
import { ScrollRect } from '@imengyu/vue-scroll-rect';

export default defineComponent({
  //注册组件
  components: {
    ScrollRect,
  },
  //省略其他代码
});
</script>
```

## 开始使用

安装完成后您就可以 [开始使用](./useage.md) 了。
