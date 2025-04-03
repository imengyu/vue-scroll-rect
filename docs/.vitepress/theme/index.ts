import DefaultTheme from 'vitepress/theme';
import MyLayout from './MyLayout.vue';
import ScrollContent from '../../index/ScrollContent.vue';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  async enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    if (!import.meta.env.SSR) {
      const plugin = await import('@highlightjs/vue-plugin');
      ctx.app.use(plugin.default, { hljs });
    }
    hljs.registerLanguage('javascript', javascript);
    ctx.app.component('ScrollContent', ScrollContent);
  },
}