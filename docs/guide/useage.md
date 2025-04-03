# 如何使用

## 基础使用

只需要将组件包裹你的需要滚动内容，设置好容器大小，内容将自动允许滚动并设置滚动条（默认垂直滚动）。

::: tip
因为容器默认占满父级，因此在未设置高度的容器中，组件可能无法撑开父级，需要设置一个确定的高度。
:::

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

可以通过 css 修改滚动条样式颜色等等，有一些 css 变量可以用于修改滚动条样式。

|名字|说明|
|----|----|
|--vue-scroll-rect-scrollbar-thumb-color|滚动条滑块的颜色|
|--vue-scroll-rect-scrollbar-thumb-color-light|滚动条滑块鼠标悬浮时的颜色|
|--vue-scroll-rect-scrollbar-thumb-color-pressed|滚动条滑块鼠标按下时的颜色|
|--vue-scroll-rect-scrollbar-thumb-radius|滚动条滑块半径|
|--vue-scroll-rect-scrollbar-thumb-margin|滚动条左右边距|
|--vue-scroll-rect-scrollbar-size|滚动条宽度|

```vue preview
<template>
  <div class="horiz-view">
    <ScrollRect scrollBarAlwaysShow class="long-content scrollbar-style1" scroll="both">
      <ScrollContent />
    </ScrollRect>
    <ScrollRect scrollBarAlwaysShow class="long-content scrollbar-style2" scroll="both">
      <ScrollContent />
    </ScrollRect>
    <ScrollRect scrollBarAlwaysShow scrollBarBackgroundClickable class="long-content scrollbar-style3" scroll="both">
      <ScrollContent />
    </ScrollRect>
    <ScrollRect scrollBarAlwaysShow class="long-content scrollbar-style4" scroll="both">
      <ScrollContent />
    </ScrollRect>
  </div>
</template>

<script setup lang="ts">
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>

<style lang="scss">
.scrollbar-style1 {
  --vue-scroll-rect-scrollbar-thumb-color: rgba(162, 145, 255, 0.3);
  --vue-scroll-rect-scrollbar-thumb-color-light: rgba(162, 145, 255, 0.5);
  --vue-scroll-rect-scrollbar-thumb-color-pressed: rgba(162, 145, 255, 0.2);
  --vue-scroll-rect-scrollbar-thumb-radius: 0px;
  --vue-scroll-rect-scrollbar-size: 12px;
}
.scrollbar-style2 {
  --vue-scroll-rect-scrollbar-thumb-color: rgba(162, 145, 255, 0.7);
  --vue-scroll-rect-scrollbar-thumb-color-light: rgba(162, 145, 255, 0.9);
  --vue-scroll-rect-scrollbar-thumb-color-pressed: rgba(162, 145, 255, 0.6);
  --vue-scroll-rect-scrollbar-thumb-radius: 20px;
  --vue-scroll-rect-scrollbar-size: 4px;
}
.scrollbar-style3 {
  --vue-scroll-rect-scrollbar-thumb-color-pressed: rgba(255, 255, 255, 0.6);
  --vue-scroll-rect-scrollbar-thumb-radius: 0px;
  --vue-scroll-rect-scrollbar-size: 12px;

  > .scrollbar {
    &.horizontal {
      border-top: 1px solid #0f0f0f;
    }
    &.vertical {
      border-left: 1px solid #0f0f0f;
    }
  }
}
.scrollbar-style4 {
  --vue-scroll-rect-scrollbar-thumb-color: rgba(0, 0, 0, 0.2);
  --vue-scroll-rect-scrollbar-thumb-color-light: rgba(0, 0, 0, 0.5);
  --vue-scroll-rect-scrollbar-thumb-color-pressed: rgba(0, 0, 0, 0.4);

  > .scrollbar {
    background-color: #fff;
  }
}
</style>
```

## 滚动条常显示

滚动条默认是在鼠标移入后渐变显示，你可以设置 `scrollBarAlwaysShow` 属性为 `true` ，滚动条将一直显示。

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

## 自定义滚动条

如果你希望换掉内置的滚动条，使用自己的滚动条组件，可以通过插槽 `scrollBarX` 和 `scrollBarY` 来实现。

插槽会传出当前滚动条滚动位置和计算长度数据 (`scrollBarValue`)，你可以根据这个百分比来计算滚动条的显示位置；传出 `onScroll` 回调用于控制滚动。。

scrollBarValue 结构如下：

|名字|类型|类型|
|----|----|----|
|show|boolean|是否显示滚动条|
|size|number|滚动条计算长度（百分比，0-100）|
|sizeRaw|number|滚动条计算长度（像素）|
|pos|number|滚动条滚动位置（百分比，0-100）|

onScroll 结构如下：

|参数|类型|
|----|----|
|pos|number|滚动条滚动位置回传（百分比，0-100）|

```vue
<template>
  <ScrollRect class="long-content" scroll="both">
    <ScrollContent />
    <template #scrollBarY="{ scrollBarValue, onScroll }">
      <MyScrollBar :value="scrollBarValue.pos" :size="scrollBarValue.size" @update:value="onScroll" />
    </template>
  </ScrollRect>
</template>
```
