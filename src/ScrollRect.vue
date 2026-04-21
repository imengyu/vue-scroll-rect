<template>
  <div 
    ref="scrollrect"
    :class="[
      'vue-scroll-rect',
      scrollBarAlwaysShow ? 'always-show-scrollbar' : '',
      scrollBarBackgroundClickable? 'background-clickable' : '',
      isDragging ? 'dragging' : '',
    ]"
    :style="{
      width: width? `${width}px` : undefined,
      height: height? `${height}px` : undefined,
    }"
    @wheel="onMouseWheel"
  >
    <div 
      ref="container" 
      :class="['scroll-content', scroll, containerClass, { 'pull-refresh-enabled': enablePullToRefresh && canScrollY }]"
      :style="{
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        ...containerStyle,
      }"
      @scroll="onScroll"
      @pointerdown="onPullPointerDown"
      @pointerup="onPullPointerUp"
      @pointercancel="onPullPointerUp"
      @lostpointercapture="onPullPointerLostCapture"
    >
      <div
        v-if="enablePullToRefresh && canScrollY"
        class="pull-refresh-track"
        :class="{ 'is-transition': pullTrackTransition }"
        :style="{ height: `${pullTrackHeight}px` }"
        aria-hidden="true"
      >
        <div class="pull-refresh-track-inner">
          <slot
            name="pullRefresh"
            :state="pullVisualState"
            :distance="pullDistance"
            :threshold="pullThreshold"
            :loading="pullToRefreshLoading"
            :loading-height="pullRefreshLoadingHeightPx"
          >
            <div class="pull-refresh-default">
              <span
                v-if="pullVisualState === 'loading'"
                class="pull-refresh-default-spinner"
                aria-hidden="true"
              />
              <span class="pull-refresh-default-text">{{ pullDefaultText }}</span>
            </div>
          </slot>
        </div>
      </div>
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
        @wheel="onMouseWheelBarX"
      >
        <div
          class="thumb"
          ref="scrollBarThumbRefX"
          :style="{ left: `${scrollBarX.pos}%`, width: `${scrollBarX.size}%` }"
          @mousedown="thumbDrageHandlerX"
          @wheel="onMouseWheelBarX"
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
        @wheel="onMouseWheelBarY"
      >
        <div 
          class="thumb"
          ref="scrollBarThumbRefY"
          :style="{ top: `${scrollBarY.pos}%`, height: `${scrollBarY.size}%` }"
          @mousedown="thumbDrageHandlerY"
          @wheel="onMouseWheelBarY"
        />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch, reactive, computed } from "vue";
import { createMouseDragHandler } from './Composeable/MouseHandler';
import { useResizeChecker } from "./Composeable/ResizeChecker";
import { throttle } from "./Composeable/MiniTimeout";

export interface ScrollRectProps {
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
  scroll?: 'both'|'none'|'vertical'|'horizontal';
  /**
   * Show scroll bar always, otherwise show scroll bar when mouse over
   * @default false
   */
  scrollBarAlwaysShow?: boolean;
  /**
   * Is able to click scroll bar background to set scroll position? (When `scrollBarAlwaysShow` is true)
   * @default true
   */
  scrollBarBackgroundClickable?: boolean;
  /**
   * CSS class of inner container
   */
  containerClass?: string;
  /**
   * Container style
   */
  containerStyle?: Record<string, any>;
  /**
   * Width of scroll rect
   */
  width?: number;
  /**
   * Height of scroll rect
   */
  height?: number;
  /**
   * Max width of inner container
   */
  maxWidth?: number;
  /**
   * Max height of inner container
   */
  maxHeight?: number;
  /**
   * Specify how many pixels of scroll distance trigger `scrollToStart` event.
   * @default 50
   */
  scrollToStartThreshold?: number;
  /**
   * Specify how many pixels of scroll distance trigger `scrollToEnd` event.
   * @default 50
   */
  scrollToEndThreshold?: number;

  /**
   * Enable pull to refresh.
   * @default false
   */
  enablePullToRefresh?: boolean;

  /**
   * Pull to refresh threshold.
   * @default 50
   */
  pullToRefreshThreshold?: number;
  /**
   * Pull-to-refresh loading state (supports v-model:pullToRefreshLoading).
   * @default false
   */
  pullToRefreshLoading?: boolean;

  /**
   * Height (px) of the pull area while loading.
   * @default 48
   */
  pullRefreshLoadingHeight?: number;

  /**
   * Maximum pull distance (px) before rubber-band clamp.
   * @default 120
   */
  pullRefreshMaxDistance?: number;
}

type ScrollSource = 'layout' | 'scroll';

const props = withDefaults(defineProps<ScrollRectProps>(),  {	
  scroll: 'both',
  scrollBarAlwaysShow: false,
  scrollBarBackgroundClickable: true,
  containerClass: '',
  scrollToStartThreshold: 50,
  scrollToEndThreshold: 50,
  enablePullToRefresh: false,
  pullToRefreshThreshold: 50,
  pullToRefreshLoading: false,
  pullRefreshLoadingHeight: 48,
  pullRefreshMaxDistance: 120,
})

const emit = defineEmits<{
  (e: 'scroll', scrollLeft: number, scrollTop: number): void;
  (e: 'resized', scrollWidth: number, scrollHeight: number): void;
  (e: 'scrollToStart'): void;
  (e: 'scrollToEnd'): void;
  (e: 'pullToRefreshStart'): void;
  (e: 'pullToRefreshEnd'): void;
  (e: 'update:pullToRefreshLoading', loading: boolean): void;
}>();

const container = ref<HTMLElement>();
const scrollrect = ref<HTMLElement>();
const scrollBarRefX = ref<HTMLElement>();
const scrollBarRefY = ref<HTMLElement>();
const scrollBarThumbRefX = ref<HTMLElement>();
const scrollBarThumbRefY = ref<HTMLElement>();
const isDragging = ref(false);

const canScrollX = computed(() => props.scroll === 'horizontal' || props.scroll === 'both');
const canScrollY = computed(() => props.scroll === 'vertical' || props.scroll === 'both');
  
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

/** 下拉加载（顶部下拉） */
const pullDistance = ref(0);
const pullTrackTransition = ref(true);
const pullActivePointerId = ref<number | null>(null);
const pullGestureStartY = ref(0);

const pullThreshold = computed(() => props.pullToRefreshThreshold);
const pullRefreshLoadingHeightPx = computed(() => props.pullRefreshLoadingHeight);

const pullVisualState = computed(() => {
  if (props.pullToRefreshLoading)
    return 'loading' as const;
  if (pullDistance.value <= 0.5)
    return 'idle' as const;
  if (pullDistance.value >= pullThreshold.value)
    return 'release' as const;
  return 'pulling' as const;
});

const pullTrackHeight = computed(() => {
  if (props.pullToRefreshLoading)
    return pullRefreshLoadingHeightPx.value;
  return pullDistance.value;
});

const pullDefaultText = computed(() => {
  switch (pullVisualState.value) {
    case 'loading':
      return '加载中…';
    case 'release':
      return '释放加载';
    case 'pulling':
      return '下拉加载';
    default:
      return '下拉加载';
  }
});

function rubberPull(raw: number) {
  const max = props.pullRefreshMaxDistance;
  const t = Math.min(Math.max(raw, 0), max * 2);
  return max * (1 - Math.exp(-t / (max * 0.9)));
}

function onPullPointerDown(e: PointerEvent) {
  if (!props.enablePullToRefresh || !canScrollY.value || props.pullToRefreshLoading)
    return;
  if (!container.value || container.value.scrollTop > 1)
    return;
  if (e.pointerType === 'mouse' && e.button !== 0)
    return;
  pullActivePointerId.value = e.pointerId;
  pullGestureStartY.value = e.clientY;
  pullTrackTransition.value = false;
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  catch {
    pullActivePointerId.value = null;
  }
}

function onPullPointerMove(e: PointerEvent) {
  if (pullActivePointerId.value === null || e.pointerId !== pullActivePointerId.value)
    return;
  if (!props.enablePullToRefresh || !canScrollY.value || props.pullToRefreshLoading)
    return;
  if (!container.value)
    return;
  if (container.value.scrollTop > 1) {
    pullDistance.value = 0;
    endPullGesture(e, true);
    return;
  }
  const dy = e.clientY - pullGestureStartY.value;
  if (dy <= 0) {
    pullDistance.value = 0;
    return;
  }
  e.preventDefault();
  pullDistance.value = rubberPull(dy * 0.55);
}

function endPullGesture(e: PointerEvent | undefined, doRelease: boolean) {
  if (pullActivePointerId.value === null)
    return;
  const id = pullActivePointerId.value;
  pullActivePointerId.value = null;
  pullTrackTransition.value = true;
  if (doRelease && container.value) {
    try {
      container.value.releasePointerCapture(id);
    }
    catch {
      // ignore
    }
  }
}

function onPullPointerUp(e: PointerEvent) {
  if (pullActivePointerId.value === null || e.pointerId !== pullActivePointerId.value)
    return;
  finishPullAfterGesture(e);
}

function onPullPointerLostCapture(e: PointerEvent) {
  if (pullActivePointerId.value === null || e.pointerId !== pullActivePointerId.value)
    return;
  finishPullAfterGesture(e);
}

function finishPullAfterGesture(e: PointerEvent) {
  const wasActive = pullActivePointerId.value !== null;
  const dist = pullDistance.value;
  endPullGesture(e, true);
  if (wasActive && !props.pullToRefreshLoading && dist >= pullThreshold.value)
    emit('pullToRefreshStart');
  pullDistance.value = 0;
}

let pullPointerMoveAttached = false;
function attachPullPointerMove() {
  if (pullPointerMoveAttached || !container.value || !props.enablePullToRefresh || !canScrollY.value)
    return;
  container.value.addEventListener('pointermove', onPullPointerMove as EventListener, { passive: false });
  pullPointerMoveAttached = true;
}
function detachPullPointerMove() {
  if (!pullPointerMoveAttached || !container.value)
    return;
  container.value.removeEventListener('pointermove', onPullPointerMove as EventListener);
  pullPointerMoveAttached = false;
}

watch(
  () => props.pullToRefreshLoading,
  (loading, prev) => {
    if (prev === true && loading === false) {
      emit('pullToRefreshEnd');
      pullDistance.value = 0;
    }
  },
);

watch(
  () => props.enablePullToRefresh && canScrollY.value,
  (ok) => {
    if (!ok) {
      pullDistance.value = 0;
      pullActivePointerId.value = null;
      nextTick(() => detachPullPointerMove());
    }
    else {
      nextTick(() => attachPullPointerMove());
    }
  },
);

let lastCalcScrollScrollWidth = 0;
let lastCalcScrollScrollHeight = 0;
let lastCalcScrollWidth = 0;
let lastCalcScrollHeight = 0;
let observer : MutationObserver|null = null;
 
// 配置观察选项
const config = { attributes: true, childList: true };

function calcScrollBarPosition(source: ScrollSource) {
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

  if (source === 'scroll') {
    if (props.scroll === 'vertical') {
      if (props.scrollToStartThreshold) {
        if (container.value.scrollTop <= props.scrollToStartThreshold)
          emit('scrollToStart');
      }
      if (props.scrollToEndThreshold) {
        if (container.value.scrollTop >= container.value.scrollHeight - props.scrollToEndThreshold - container.value.offsetHeight)
          emit('scrollToEnd');
      }
    } else if (props.scroll === 'horizontal') {
      if (props.scrollToStartThreshold) {
        if (container.value.scrollLeft <= props.scrollToStartThreshold)
          emit('scrollToStart');
      }
      if (props.scrollToEndThreshold) {
        if (container.value.scrollLeft >= container.value.scrollWidth - props.scrollToEndThreshold - container.value.offsetWidth)
          emit('scrollToEnd');
      }
    }
    emit('scroll', container.value.scrollLeft, container.value.scrollTop);
  }
}

function calcScroll(source: ScrollSource, force = false) {
  
  if (!container.value) 
    return;
  let _canScrollX = canScrollX.value;
  let _canScrollY = canScrollY.value;

  const xScrollValueChanged = _canScrollX && (lastCalcScrollScrollWidth !== container.value.scrollWidth
    || lastCalcScrollWidth !== container.value.offsetWidth); 
  const yScrollValueChanged = canScrollY && (lastCalcScrollScrollHeight !== container.value.scrollHeight 
    || lastCalcScrollHeight !== container.value.offsetHeight); 

  if (!force && !xScrollValueChanged && !yScrollValueChanged)
    return;

  const style = window.getComputedStyle(container.value);

  if (style.overflow === 'hidden' || style.overflowX === 'hidden') 
    _canScrollX = false;
  if (style.overflow === 'hidden' || style.overflowY === 'hidden') 
    _canScrollY = false;

  scrollBarX.show = _canScrollX;
  scrollBarY.show = _canScrollY;

  calcScrollBarPosition(source);

  lastCalcScrollWidth = container.value.offsetWidth;
  lastCalcScrollHeight = container.value.offsetHeight
  lastCalcScrollScrollWidth = container.value.scrollWidth;
  lastCalcScrollScrollHeight = container.value.scrollHeight;

  emit('resized', lastCalcScrollScrollWidth, lastCalcScrollScrollHeight);
}

function onScroll(event: Event) {
  calcScrollBarPosition('scroll');
}

const manualWheelScrollSizeX = 140;
const manualWheelScrollSizeY = 120;

const whellX = throttle((postive: boolean) => {
  container.value?.scrollTo({
    left: container.value.scrollLeft + (postive ? manualWheelScrollSizeX : -manualWheelScrollSizeX),
    behavior: 'smooth',
  });
}, 120);
const whellY = throttle((postive: boolean) => {
  container.value?.scrollTo({
    top: container.value.scrollTop + (postive ? manualWheelScrollSizeY : -manualWheelScrollSizeY),
    behavior: 'smooth',
  });
}, 20);

//只有横向滚动时，使鼠标可以直接滚动
function onMouseWheel(e: WheelEvent) {
  if (props.scroll == 'horizontal') {
    if (e.deltaMode == 0)
      whellX(e.deltaY > 0);
    e.preventDefault();
    e.stopPropagation();
  }
}

function onMouseWheelBarX(e: WheelEvent) {
  if (e.deltaMode == 0) {
    whellX(e.deltaY > 0);
    e.preventDefault();
    e.stopPropagation();
  }
}

function onMouseWheelBarY(e: WheelEvent) {
  if (e.deltaMode == 0) {
    whellY(e.deltaY > 0);
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
  () => calcScroll('layout'), 
  () => calcScroll('layout')
);

onMounted(() => {
  nextTick(() => {
    setTimeout(() => calcScroll('layout',true), 200);
    startResizeChecker();
    observer = new MutationObserver(() => calcScroll('layout'));
    observer.observe(container.value!, config);
    attachPullPointerMove();
  });
});
onBeforeUnmount(() => {
  detachPullPointerMove();
  stopResizeChecker();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

export type ScrollRectPullRefreshState = 'idle' | 'pulling' | 'release' | 'loading';

export interface ScrollRectPullRefreshSlotParams {
  /**
   * 下拉状态：未拉动 / 拉动中 / 可释放 / 加载中
   */
  state: ScrollRectPullRefreshState;
  /**
   * 当前下拉距离（像素）
   */
  distance: number;
  /**
   * 触发加载的阈值（像素），与 `pullToRefreshThreshold` 一致
   */
  threshold: number;
  /**
   * 是否处于加载中（与 `pullToRefreshLoading` / v-model 一致）
   */
  loading: boolean;
  /**
   * 加载区域高度（像素），与 `pullRefreshLoadingHeight` 一致
   */
  loadingHeight: number;
}

export interface ScrollRectScrollBarSlotParams {
  scrollValue: {
    /**
     * Is scrollbar visible?
     */
    show: boolean,
    /**
     * Scroll bar calculation length (percentage, 0-100)
     */
    size: number,
    /**
     * Scroll bar calculation length (pixel)
     */
    sizeRaw: number,
    /**
     * Scroll bar scrolling position (percentage, 0-100)
     */
    pos: number,
  },
  /**
   * Scroll bar scrolling position callback 
   * @param pec (percentage, 0-100)
   */
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
   * Scroll to 0,0
   */
  scrollToStart() : void;
  /**
   * Scroll to container.scrollWidth, container.scrollHeight
   */
  scrollToEnd() : void;
}

defineExpose<ScrollRectInstance>({
  refreshScrollState() {
    calcScroll('layout', true);
  },
  getScrollContainer() {
    return container.value;
  },
  scrollTo(x: number, y: number) {
    container.value?.scrollTo(x, y);
  },
  scrollToStart() {
    container.value?.scrollTo(0, 0);
  },
  scrollToEnd() {
    container.value?.scrollTo(container.value.scrollWidth, container.value.scrollHeight);
  },
})

</script>

<style lang="scss">
:root {
  --vue-scroll-rect-scrollbar-thumb-color: rgba(122,122,122, 0.3);
  --vue-scroll-rect-scrollbar-thumb-color-light: rgba(122, 122, 122, 0.5);
  --vue-scroll-rect-scrollbar-thumb-color-pressed: rgba(112, 112, 112, 0.2);
  --vue-scroll-rect-scrollbar-thumb-radius: 5px;
  --vue-scroll-rect-scrollbar-thumb-margin: 0px;
  --vue-scroll-rect-scrollbar-size: 8px;
  --vue-scroll-rect-pull-refresh-text-color: rgba(0, 0, 0, 0.55);
  --vue-scroll-rect-pull-refresh-font-size: 13px;
  --vue-scroll-rect-pull-refresh-spinner-color: rgba(0, 0, 0, 0.35);
}

.vue-scroll-rect {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;

  > .scroll-content {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */

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

    &.pull-refresh-enabled {
      touch-action: pan-y;
    }

    .pull-refresh-track {
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;

      &.is-transition {
        transition: height 0.22s ease;
      }
    }

    .pull-refresh-track-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 6px 12px;
      color: var(--vue-scroll-rect-pull-refresh-text-color);
      font-size: var(--vue-scroll-rect-pull-refresh-font-size);
      user-select: none;
      -webkit-user-select: none;
    }

    .pull-refresh-default {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      line-height: 1.25;
    }

    .pull-refresh-default-spinner {
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 2px solid var(--vue-scroll-rect-pull-refresh-spinner-color);
      border-top-color: transparent;
      border-radius: 50%;
      animation: vue-scroll-rect-pull-spin 0.75s linear infinite;
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

@keyframes vue-scroll-rect-pull-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>