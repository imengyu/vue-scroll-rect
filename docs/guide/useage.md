# 如何使用

## 基础使用

只需要将组件包裹你的需要滚动内容，设置好容器大小，内容将自动允许滚动并设置滚动条（默认垂直滚动）。

```vue preview
<template>
  <ScrollRect class="long-content" containerClass="content">
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
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>

<style lang="scss">
.long-content {
  width: 100%;
  height: 300px;
  color: #fff;
  background-color: #1f1f1f;

  .content {
    padding: 20px;
  }
}
</style>
```

## 滚动方向

可以通过 `scroll` 属性设置仅垂直滚动或仅水平滚动，或者二者都滚动。

* `both` : 水平滚动和垂直滚动
* `vertical` : 垂直滚动
* `horizontal` : 水平滚动
* `none` : 禁止滚动

```vue preview
<template>
  <div class="horiz-view">
    <ScrollRect class="long-content" scroll="both">
      <ScrollContent title="scroll: both" />
    </ScrollRect>
    <ScrollRect class="long-content" scroll="vertical">
      <ScrollContent title="scroll: vertical" />
    </ScrollRect>
    <ScrollRect class="long-content" scroll="horizontal">
      <ScrollContent title="scroll: horizontal" />
    </ScrollRect>
    <ScrollRect class="long-content" scroll="none">
      <ScrollContent title="scroll: none" />
    </ScrollRect>
  </div>
</template>

<script setup lang="ts">
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>

<style lang="scss">
.horiz-view {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > .long-content {
    flex: 1 1 50%;
    width: 50%;
    border: 1px solid #ccc;
  }
}
.long-content {
  padding: 20px;
}
</style>
```

## 滚动条样式




## 滚动条常显示

设置 `scrollBarAlwaysShow` 属性为 `true` ，滚动条将一直显示。

```vue preview
<template>
  <ScrollRect class="long-content" scroll="both" :scrollBarAlwaysShow="true">
    <ScrollContent />
  </ScrollRect>
</template>

<script setup lang="ts">
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>
```

设置 `scrollBarBackgroundClickable` 属性为 `true` ，滚动条背景点击区域也可触发滚动。

```vue preview
<template>
  <ScrollRect class="long-content scrollbar-background" scroll="both" :scrollBarAlwaysShow="true" :scrollBarBackgroundClickable="true">
    <ScrollContent />
  </ScrollRect>
</template>

<script setup lang="ts">
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>
```
