import { defineConfig } from 'vitepress'
import { resolve } from 'path';
import MarkdownPreview from 'vite-plugin-markdown-preview'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue scroll rect",
  description: "A simple scroll rect component for vue",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '教程', link: '/guide/index' },
      { text: 'API', link: '/api/index' }
    ],
    sidebar: [
      {
        text: '教程',
        items: [
          { text: '开始之前', link: '/guide/index' },
          { text: '安装', link: '/guide/install' },
          { text: '如何使用', link: '/guide/useage' },
          { text: 'API', link: '/api/index' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  locales: {
  },
  vite: {
    plugins: [ MarkdownPreview() as any ],
    ssr: {
      noExternal: ['@imengyu/vue3-context-menu','vue']
    },
    resolve: {
      alias: {
        '@imengyu/vue-scroll-rect': resolve(__dirname, '../../src')
      },
    },
  },
})
