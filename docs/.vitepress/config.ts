import { defineConfig } from 'vitepress'
import { resolve } from 'path';
import MarkdownPreview from 'vite-plugin-markdown-preview'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue scroll rect",
  description: "A simple scroll rect component for vue",
  base: '/vue-scroll-rect-docs/',
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
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/imengyu/vue-scroll-rect' }
    ]
  },
  locales: {
    root: {
      label: '中文',
      lang: 'zh',
    },
    en: {
      label: 'English',
      lang: 'en', 
      description: 'A simple, beautiful Vue custom scroll rect component',  
      themeConfig: {
        socialLinks: [
          { icon: 'github', link: 'https://github.com/imengyu/vue-scroll-rect' },
        ],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2025 imengyu.top'
        },
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/index' },
          { text: 'API', link: '/api/index' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Start', link: '/guide/index' },
              { text: 'Install', link: '/guide/install' },
              { text: 'Usage', link: '/guide/useage' },
            ]
          }
        ],
      }
    },
  },
  vite: {
    plugins: [ MarkdownPreview() as any ],
    ssr: {
      noExternal: ['@imengyu/vue3-context-menu','@highlightjs/vue-plugin','vue']
    },
    resolve: {
      alias: {
        '@imengyu/vue-scroll-rect': resolve(__dirname, '../../src')
      },
    },
  },
})
