# Ueage

## Basic usage

Just wrap the components around the content you need to scroll through, set the container size, and the content will automatically allow scrolling and set a scrollbar (default vertical scrolling).

::: tip
The content expands the parent container, so when the height or maximum height is not set, the scrollbar will not appear, and a certain height needs to be set.
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
  color: #333;
  background-color: #efefef;

  .content {
    padding: 20px;
  }
}
</style>
```

### Automatically expands area and scrolling

Sometimes, you may want the scrolling area to automatically expand the container when it is very small and only start scrolling when it exceeds a specified height. You can set the `maxHeight` or `maxWidth` properties,
When the content height exceeds the set maximum value, scrolling begins.

```vue preview
<template>
  <ScrollRect class="long-content2" containerClass="content" :maxHeight="300">
    <button @click="add">+ Add item</button>
    <p v-for="item in list" :key="item.id">
      {{ item.text }}
      <button @click="remove(item.text)">Delete</button>
    </p> 
  </ScrollRect>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';

const list = ref<{
  id: number,
  text: string,
}[]>([]);

let id = 0;

function add() {
  list.value.push({ id: ++id, text: id + ' Hello, This is a simple scroll rect component for Vue3.' }); 
}
function remove(id: number) {
  list.value.splice(list.value.findIndex(item => item.id === id), 1);
}
</script>

<style lang="scss">
.long-content2 {
  width: 100%;
  color: #333;
  background-color: #efefef;

  .content {
    padding: 20px;
  }
  p {
    margin: 0;
    padding: 10px;
    border-bottom: 1px solid #ccc;

    button {
      margin-bottom: 0;
    }
  }
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
</style>
```

## Scrolling direction

Can use `scroll` attribute to scroll only vertically or horizontally, or both.

* `both` : Vertically and horizontally
* `vertical` : Vertically.
* `horizontal` : Horizontally
* `none` : No scroll.

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

## Pull to refresh

Drag down at the **top** of the scroll area to trigger a refresh (pointer: touch or mouse). Set `scroll` to `vertical` or `both`; pull-to-refresh is not available when `scroll` is `horizontal` only.

With `enablePullToRefresh` enabled, when `scrollTop === 0` the user can pull down; on release, if the pull distance is at least `pullToRefreshThreshold`, `pullToRefreshStart` fires. Use `v-model:pullToRefreshLoading` for the loading state: set it to `true` when refresh starts and `false` when done; `pullToRefreshEnd` is emitted after loading finishes.

::: tip
Set `pullToRefreshLoading` to `true` **synchronously** at the beginning of the `pullToRefreshStart` handler, then run your async work, to avoid a flicker in the pull header.
:::

| Prop | Description |
|------|-------------|
| `enablePullToRefresh` | Enable pull-to-refresh, default `false` |
| `pullToRefreshThreshold` | Minimum pull distance (px) to trigger refresh, default `50` |
| `pullToRefreshLoading` | Loading flag, supports `v-model:pullToRefreshLoading`, default `false` |
| `pullRefreshLoadingHeight` | Height (px) of the top pull area while loading, default `48` |
| `pullRefreshMaxDistance` | Max pull distance / damping reference (px), default `120` |

| Event | Description |
|-------|-------------|
| `pullToRefreshStart` | Fired on release past the threshold; start your refresh here |
| `pullToRefreshEnd` | Fired when `pullToRefreshLoading` goes from `true` to `false` |

By default the header shows short Chinese hints (pull / release / loading). Override completely with the `pullRefresh` slot. Scoped slot props:

| Name | Type | Description |
|------|------|-------------|
| `state` | `'idle' \| 'pulling' \| 'release' \| 'loading'` | Current state |
| `distance` | `number` | Current pull distance (px) |
| `threshold` | `number` | Same as `pullToRefreshThreshold` |
| `loading` | `boolean` | Same as `pullToRefreshLoading` |
| `loadingHeight` | `number` | Same as `pullRefreshLoadingHeight` |

You can tune the default look with CSS variables such as `--vue-scroll-rect-pull-refresh-text-color`, `--vue-scroll-rect-pull-refresh-font-size`, and `--vue-scroll-rect-pull-refresh-spinner-color`.

```vue preview
<template>
  <ScrollRect
    class="pull-demo"
    scroll="vertical"
    containerClass="content"
    :enable-pull-to-refresh="true"
    v-model:pull-to-refresh-loading="loading"
    :pull-to-refresh-threshold="50"
    @pull-to-refresh-start="onPullRefresh"
  >
    <p class="hint">Pull down from the top to refresh (simulated 1.5s request)</p>
    <p v-for="n in 24" :key="n" class="row">List row {{ n }}</p>
  </ScrollRect>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';

const loading = ref(false);

async function onPullRefresh() {
  loading.value = true;
  await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  loading.value = false;
}
</script>

<style lang="scss">
.pull-demo {
  width: 100%;
  height: 280px;
  color: #333;
  background-color: #efefef;

  .content {
    padding: 12px 20px 20px;
  }
  .hint {
    margin: 0 0 12px;
    font-size: 13px;
    color: #666;
  }
  .row {
    margin: 0;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
  }
}
</style>
```

### Custom pull header

```vue
<template>
  <ScrollRect
    scroll="vertical"
    :enable-pull-to-refresh="true"
    v-model:pull-to-refresh-loading="loading"
    @pull-to-refresh-start="onPullRefresh"
  >
    <template #pullRefresh="{ state, distance, threshold, loading: isLoading }">
      <div class="my-pull">
        <span v-if="isLoading">Refreshing…</span>
        <span v-else-if="state === 'release'">Release to refresh</span>
        <span v-else>Pull {{ Math.round(distance) }} / {{ threshold }} px</span>
      </div>
    </template>
    <p v-for="n in 10" :key="n">Item {{ n }}</p>
  </ScrollRect>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScrollRect } from '@imengyu/vue-scroll-rect';

const loading = ref(false);

async function onPullRefresh() {
  loading.value = true;
  await new Promise<void>((r) => setTimeout(r, 800));
  loading.value = false;
}
</script>
```

## Back to top

Set `enableBackToTop` to `true` to enable the back-to-top region (default button or slot). The control **only appears after the scroll offset exceeds `backToTopThreshold`**: for `vertical` / `both` use `scrollTop`, for `horizontal` / `both` use `scrollLeft`. Clicking scrolls to the origin `(0, 0)`, same as `scrollToStart()`.

The default button fades and slides in with **opacity + translateY** (tunable via CSS variables). You can also call `scrollToStart()` from a template **ref**.

| Prop | Description |
|------|-------------|
| `enableBackToTop` | Enable the back-to-top region (default button or `backToTop` slot), default `false` |
| `backToTopThreshold` | Show the control after this offset (px); for `both`, either axis past the threshold shows it, default `120` |

**`backToTop`** slot scoped props:

| Name | Type | Description |
|------|------|-------------|
| `onBackToTop` | `() => void` | Scrolls to the start; same as `scrollToStart` |
| `visible` | `boolean` | Whether the control should show (same logic as the default button) |

Override styling with: `--vue-scroll-rect-back-to-top-bg`, `--vue-scroll-rect-back-to-top-bg-hover`, `--vue-scroll-rect-back-to-top-color`, `--vue-scroll-rect-back-to-top-transition-duration`, `--vue-scroll-rect-back-to-top-translate-y`.

```vue preview
<template>
  <ScrollRect
    class="btt-demo"
    scroll="vertical"
    containerClass="content"
    :enable-back-to-top="true"
  >
    <p class="hint">Scroll down, then use the button at the bottom-right to return to the top.</p>
    <p v-for="n in 32" :key="n" class="row">List row {{ n }}</p>
  </ScrollRect>
</template>

<script setup lang="ts">
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>

<style lang="scss">
.btt-demo {
  width: 100%;
  height: 300px;
  color: #333;
  background-color: #efefef;

  .content {
    padding: 12px 20px 20px;
  }
  .hint {
    margin: 0 0 12px;
    font-size: 13px;
    color: #666;
  }
  .row {
    margin: 0;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
  }
}
</style>
```

### Custom back-to-top

```vue
<template>
  <ScrollRect scroll="vertical" :enable-back-to-top="true" containerClass="content">
    <template #backToTop="{ onBackToTop, visible }">
      <button
        type="button"
        class="my-back-top"
        :class="{ 'is-on': visible }"
        @click="onBackToTop"
      >
        ↑ Top
      </button>
    </template>
    <p v-for="n in 20" :key="n">Item {{ n }}</p>
  </ScrollRect>
</template>

<script setup lang="ts">
import { ScrollRect } from '@imengyu/vue-scroll-rect';
</script>

<style lang="scss" scoped>
.my-back-top {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.my-back-top.is-on {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
</style>
```

## Scrollbar

### Scroll bar style

You can modify scrollbar styles, colors, and more through CSS, and there are some CSS variables that can be used to modify scrollbar styles.

|Name|Desc|
|----|----|
|--vue-scroll-rect-scrollbar-thumb-color|Color of scrollbar thumb|
|--vue-scroll-rect-scrollbar-thumb-color-light|Color of scrollbar thumb when hover|
|--vue-scroll-rect-scrollbar-thumb-color-pressed|Color of scrollbar thumb when pressed|
|--vue-scroll-rect-scrollbar-thumb-radius|Border radius of scrollbar thumb|
|--vue-scroll-rect-scrollbar-thumb-margin|Margin of scrollbar thumb|
|--vue-scroll-rect-scrollbar-size|Width of scrollbar thumb|

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
    background-color: #333;
  }
}
</style>
```

### Always show scroll bar

The scrollbar defaults will fade show when the mouse is moved in. You can set the `scrollBarAlwaysShow` property to `true`, and the scrollbar will keep visible state.

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

Set the `scrollBarBackgroundClickable` property to `true` and the scrollbar background clicking area can also trigger scrolling.

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

### Custom scrollbar

If you want to replace the built-in scrollbar and use your own scrollbar component, you can achieve it through the slots `scrollBarX` and `scrollBarY`.

The slot will transmit the current scrollbar scrolling position and calculated length data (`scrollBarValue`), and you can calculate the display position of the scrollbar based on this percentage; The `onScroll` callback is used to control scrolling..

scrollBarValue struct：

|Name|Type|Desc|
|----|----|----|
|show|boolean|Is scrollbar visible? |
|size|number|Scroll bar calculation length (percentage, 0-100)|
|sizeRaw|number|Scroll bar calculation length (pixel)|
|pos|number|Scroll bar scrolling position (percentage, 0-100)|

Function onScroll:

|Param|Name|Type|
|----|----|----|
|pos|number|Scroll bar scrolling position callback (percentage, 0-100)|

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
