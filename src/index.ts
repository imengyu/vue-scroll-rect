import type { App } from 'vue';
import ScrollRect from './ScrollRect.vue';
export * from './ScrollRect.vue';

export {
  ScrollRect,
}

export default {
  install(app: App) {
    app.component("scroll-rect", ScrollRect);
  }
}