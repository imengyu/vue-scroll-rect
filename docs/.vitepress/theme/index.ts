import DefaultTheme from 'vitepress/theme';
import MyLayout from './MyLayout.vue';
import ScrollContent from '../../index/ScrollContent.vue';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import vue from '@highlightjs/vue-plugin';
import 'highlight.js/styles/atom-one-dark.css';

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    hljs.registerLanguage('javascript', javascript);
    ctx.app.component('ScrollContent', ScrollContent);
    ctx.app.use(vue, { hljs });
  },
}