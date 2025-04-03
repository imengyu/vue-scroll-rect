<template>
  <div 
    ref="scrollrect"
    :class="[
      'vue-scroll-rect',
      scrollBarAlwaysShow ? 'always-show-scrollbar' : '',
      scrollBarBackgroundClickable? 'background-clickable' : '',
      isDragging ? 'dragging' : '',
    ]" 
    @wheel="mouseWheel"
  >
    <div 
      ref="container" 
      :class="['scroll-content', scroll, containerClass]"
      @scroll="calcScrollBarPosition"
    >
      <slot />
    </div>
    <slot
      v-if="scrollBarX.show"
      name="scrollBarX"
      :scrollBarValue="scrollBarX"
      :onScroll="customScrollX"
    >
      <div 
        ref="scrollBarRefX"
        class="scrollbar horizontal"
        @click="scrollbarClickScrollX"
        @wheel="mouseWheelBarX"
      >
        <div
          class="thumb"
          ref="scrollBarThumbRefX"
          :style="{ left: `${scrollBarX.pos}%`, width: `${scrollBarX.size}%` }"
          @mousedown="thumbDrageHandlerX"
          @wheel="mouseWheelBarX"
        />
      </div>
    </slot>
    <slot
      v-if="scrollBarY.show"
      name="scrollBarY"
      :scrollBarValue="scrollBarY"
      :onScroll="customScrollY"
    >
      <div 
        v-if="scrollBarY.show"
        ref="scrollBarRefY"
        class="scrollbar vertical"
        @click="scrollbarClickScrollY"
        @wheel="mouseWheelBarY"
      >
        <div 
          class="thumb"
          ref="scrollBarThumbRefY"
          :style="{ top: `${scrollBarY.pos}%`, height: `${scrollBarY.size}%` }"
          @mousedown="thumbDrageHandlerY"
          @wheel="mouseWheelBarY"
        />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, type PropType, reactive } from "vue";
import { createMouseDragHandler } from './Composeable/MouseHandler';
import { useResizeChecker } from "./Composeable/ResizeChecker";

const props = defineProps({	
  /**
   * Scroll direction
   * 
   * * both : Scroll in both directions
   * * vertical : Scroll only in vertical direction
   * * horizontal : Scroll only in horizontal direction
   * * none : Disable scroll
   * 
   * @default both
   */
  scroll: {
    type: String as PropType<'both'|'none'|'vertical'|'horizontal'>,
    default: 'both'
  },
  /**
   * Show scroll bar always, otherwise show scroll bar when mouse over
   * @default false
   */
  scrollBarAlwaysShow: {
    type: Boolean,
    default: false
  },
  /**
   * Is able to click scroll bar background to set scroll position? (When `scrollBarAlwaysShow` is true)
   * @default true
   */
  scrollBarBackgroundClickable: {
    type: Boolean,
    default: false,
  },
  /**
   * CSS class of inner container
   */
  containerClass: {
    type: String,
    default: ''
  },
})

const emit = defineEmits([ 'scroll' ])

const container = ref<HTMLElement>();
const scrollrect = ref<HTMLElement>();
const scrollBarRefX = ref<HTMLElement>();
const scrollBarRefY = ref<HTMLElement>();
const scrollBarThumbRefX = ref<HTMLElement>();
const scrollBarThumbRefY = ref<HTMLElement>();
const isDragging = ref(false);
  
const scrollBarX = reactive({
  show: false,
  size: 0,
  sizeRaw: 0,
  pos: 0,
});
const scrollBarY = reactive({
  show: false,
  size: 0,
  sizeRaw: 0,
  pos: 0,
});

let lastCalcScrollScrollWidth = 0;
let lastCalcScrollScrollHeight = 0;
let lastCalcScrollWidth = 0;
let lastCalcScrollHeight = 0;
let observer : MutationObserver|null = null;
 
// 配置观察选项
const config = { attributes: true, childList: true };

function calcScrollBarPosition() {
  if (!container.value) 
    return;
  if (scrollBarX.show) {
    const sizePrecent = (container.value.offsetWidth / container.value.scrollWidth);
    scrollBarX.sizeRaw = sizePrecent * container.value.offsetWidth;
    scrollBarX.size = sizePrecent * 100;
    scrollBarX.pos = (container.value.scrollLeft / (container.value.scrollWidth - container.value.offsetWidth)) * (100 - scrollBarX.size);
    if (sizePrecent >= 1)
      scrollBarX.show = false;
  }
  if (scrollBarY.show) {
    const sizePrecent = (container.value.offsetHeight / container.value.scrollHeight);
    scrollBarY.sizeRaw = sizePrecent * container.value.offsetHeight;
    scrollBarY.size = sizePrecent * 100;
    scrollBarY.pos = (container.value.scrollTop / (container.value.scrollHeight - container.value.offsetHeight)) * (100 - scrollBarY.size);
    if (sizePrecent >= 1)
      scrollBarY.show = false;
  }
  emit('scroll', container.value.scrollLeft, container.value.scrollTop);
}

function calcScroll(force = false) {
  
  if (!container.value) 
    return;
  let canScrollX = props.scroll === 'horizontal' || props.scroll === 'both';
  let canScrollY = props.scroll === 'vertical' || props.scroll === 'both';

  const xScrollValueChanged = canScrollX && (lastCalcScrollScrollWidth !== container.value.scrollWidth
    || lastCalcScrollWidth !== container.value.offsetWidth); 
  const yScrollValueChanged = canScrollY && (lastCalcScrollScrollHeight !== container.value.scrollHeight 
    || lastCalcScrollHeight !== container.value.offsetHeight); 

  if (!force && !xScrollValueChanged && !yScrollValueChanged)
    return;

  const style = window.getComputedStyle(container.value);

  if (style.overflow === 'hidden' || style.overflowX === 'hidden') 
    canScrollX = false;
  if (style.overflow === 'hidden' || style.overflowY === 'hidden') 
    canScrollY = false;

  scrollBarX.show = canScrollX;
  scrollBarY.show = canScrollY;

  calcScrollBarPosition();

  lastCalcScrollWidth = container.value.offsetWidth;
  lastCalcScrollHeight = container.value.offsetHeight
  lastCalcScrollScrollWidth = container.value.scrollWidth;
  lastCalcScrollScrollHeight = container.value.scrollHeight;
}

const manualWheelScrollSizeX = 140;
const manualWheelScrollSizeY = 70;

//只有横向滚动时，使鼠标可以直接滚动
function mouseWheel(e: WheelEvent) {
  if (props.scroll == 'horizontal') {
    if (e.deltaMode == 0) {
      container.value?.scrollTo({
        left: container.value.scrollLeft + (e.deltaY > 0 ? manualWheelScrollSizeX : -manualWheelScrollSizeX),
        behavior: 'smooth',
      });
    }
    e.preventDefault();
    e.stopPropagation();
  }
}
function mouseWheelBarX(e: WheelEvent) {
  if (e.deltaMode == 0) {
    container.value?.scrollTo({
      left: container.value.scrollLeft + (e.deltaY > 0 ? manualWheelScrollSizeX : -manualWheelScrollSizeX),
      behavior: 'smooth',
    });
    e.preventDefault();
    e.stopPropagation();
  }
}
function mouseWheelBarY(e: WheelEvent) {
  if (e.deltaMode == 0) {
    container.value?.scrollTo({
      top: container.value.scrollTop + (e.deltaY > 0 ? manualWheelScrollSizeY : -manualWheelScrollSizeY),
      behavior: 'smooth',
    });
    e.preventDefault();
    e.stopPropagation();
  }
}


//滚动条滚动处理
let mouseDragDownInBarX = 0, mouseDragDownOutBarAbsX = 0;
let mouseDragDownInBarY = 0, mouseDragDownOutBarAbsY = 0;
const thumbDrageHandlerX = createMouseDragHandler({
  onDown(e) { 
    if (!scrollBarRefX.value || !scrollBarThumbRefX.value)
      return false;
    mouseDragDownInBarX = e.offsetX;
    mouseDragDownOutBarAbsX = e.x - e.offsetX - scrollBarThumbRefX.value.offsetLeft;
    e.preventDefault();
    isDragging.value = true;
    return true;
  },
  onMove(downPos, movedPos, e) {
    if (container.value && scrollBarRefX.value) {
      setScrollLeft(e.x - mouseDragDownInBarX - mouseDragDownOutBarAbsX);
      e.preventDefault();
      e.stopPropagation();
    }
  },
  onUp() {
    isDragging.value = false;
  },
})
const thumbDrageHandlerY = createMouseDragHandler({
  onDown(e) { 
    if (!scrollBarRefY.value || !scrollBarThumbRefY.value)
      return false;
    mouseDragDownInBarY = e.offsetY;
    mouseDragDownOutBarAbsY = e.y - e.offsetY - scrollBarThumbRefY.value.offsetTop;
    e.preventDefault();
    isDragging.value = true;
    return true;
  },
  onMove(downPos, movedPos, e) {
    if (container.value && scrollBarRefY.value) {
      setScrollTop(e.y - mouseDragDownInBarY - mouseDragDownOutBarAbsY);
      e.preventDefault();
      e.stopPropagation();
    }
  },
  onUp() {
    isDragging.value = false;
  },
})

function customScrollX(x: number) {
  if (!container.value)
    return;
  container.value.scrollLeft = (x / 100) * (container.value.scrollWidth - container.value.offsetWidth);
}
function customScrollY(y: number) {
  if (!container.value)
    return;
  container.value.scrollLeft = (y / 100) * (container.value.scrollHeight - container.value.offsetHeight);
}
function setScrollLeft(x: number) {
  if (!container.value)
    return;
  container.value.scrollLeft = x
        / (container.value.offsetWidth - scrollBarX.sizeRaw)
        * (container.value.scrollWidth - container.value.offsetWidth);
}
function setScrollTop(y: number) {
  if (!container.value)
    return;
  container.value.scrollTop = y
        / (container.value.offsetHeight - scrollBarY.sizeRaw)
        * (container.value.scrollHeight - container.value.offsetHeight);
}

function scrollbarClickScrollX(e: MouseEvent) {
  if (props.scrollBarBackgroundClickable)
    setScrollLeft(e.offsetX - scrollBarX.sizeRaw / 2);
}
function scrollbarClickScrollY(e: MouseEvent) {
  if (props.scrollBarBackgroundClickable)
    setScrollTop(e.offsetY - scrollBarY.sizeRaw / 2);
}

//大小更改事件
const {
  startResizeChecker,
  stopResizeChecker,
} = useResizeChecker(
  container, 
  () => calcScroll(), 
  () => calcScroll()
);

onMounted(() => {
  nextTick(() => {
    setTimeout(() => calcScroll(true), 200);
    calcScroll(true);
    startResizeChecker();
    observer = new MutationObserver(() => calcScroll());
    observer.observe(container.value!, config);
  });
});
onBeforeUnmount(() => {
  stopResizeChecker();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

export interface ScrollRectScrollBarSlotParams {
  scrollValue: {
    show: boolean,
    size: number,
    sizeRaw: number,
    pos: number,
  },
  onScroll: (pec: number) => void,
}
export interface ScrollRectInstance {
  /**
   * Force update scrollbar state
   */
  refreshScrollState(): void;
  /**
   * Get scroll containerElement
   */
  getScrollContainer(): HTMLElement | undefined;
  /**
   * Scroll to position
   * @param x X scroll pos (pixel)
   * @param y Y scroll pos (pixel)
   */
  scrollTo(x: number, y: number): void;
  /**
   * Scroll to top
   */
  scrollToTop() : void;
  /**
   * Scroll to bottom
   */
  scrollToBottom() : void;
}

defineExpose<ScrollRectInstance>({
  refreshScrollState() {
    calcScroll(true);
  },
  getScrollContainer() {
    return container.value;
  },
  scrollTo(x: number, y: number) {
    container.value?.scrollTo(x, y);
  },
  scrollToTop() {
    container.value?.scrollTo(0, 0);
  },
  scrollToBottom() {
    container.value?.scrollTo(container.value.scrollWidth, container.value.scrollHeight);
  },
})

</script>

<style lang="scss">
:root {
  --vue-scroll-rect-scrollbar-thumb-color: rgba(255,255,255, 0.3);
  --vue-scroll-rect-scrollbar-thumb-color-light: rgba(255,255,255, 0.5);
  --vue-scroll-rect-scrollbar-thumb-color-pressed: rgba(255,255,255, 0.2);
  --vue-scroll-rect-scrollbar-thumb-radius: 5px;
  --vue-scroll-rect-scrollbar-thumb-margin: 0px;
  --vue-scroll-rect-scrollbar-size: 8px;
}

.vue-scroll-rect {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;

  > .scroll-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    &::-ms-scrollbar {
      width: 0;
      height: 0;
    }

    &.both {
      overflow: scroll;
    }
    &.horizontal {
      overflow-x: scroll;
    }
    &.vertical {
      overflow-y: scroll;
    }
  }

  &:hover > .scrollbar {
    opacity: 1;
    transition: opacity 0.1s;
  }

  &.always-show-scrollbar, .dragging {
    > .scrollbar {
      opacity: 1;
    }
  }
  &.background-clickable {
    > .scrollbar {
      pointer-events: all;
    }
  }

  > .scrollbar {
    position: absolute;
    opacity: 0;
    transition: opacity 1.5s;
    pointer-events: none;

    &:hover {
      opacity: 1;
    }
    .thumb {
      position: absolute;
      background-color: var(--vue-scroll-rect-scrollbar-thumb-color);
      border-radius: var(--vue-scroll-rect-scrollbar-thumb-radius);
      pointer-events: all;

      &:hover {
        background-color: var( --vue-scroll-rect-scrollbar-thumb-color-light);
      }
      &:active {
        background-color: var( --vue-scroll-rect-scrollbar-thumb-color-pressed);
      }
    }

    &.horizontal {
      left: 0;
      bottom: 0;
      right: 0;
      height: var(--vue-scroll-rect-scrollbar-size);

      .thumb {
        top: var(--vue-scroll-rect-scrollbar-thumb-margin);
        bottom: var(--vue-scroll-rect-scrollbar-thumb-margin);
      }
    }
    &.vertical {
      top: 0;
      bottom: 0;
      right: 0;
      width: var(--vue-scroll-rect-scrollbar-size);

      .thumb {
        left: var(--vue-scroll-rect-scrollbar-thumb-margin);
        right: var(--vue-scroll-rect-scrollbar-thumb-margin);
      }
    }
  }
}
</style>