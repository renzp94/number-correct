import { defineConfig } from 'vitepress'
import pkg from '../../package.json'

export default defineConfig({
  title: 'number-correct',
  description: '一款零依赖、基于竖式计算方式矫正js数字计算精度的库',
  lastUpdated: true,
  metaChunk: true,
  rewrites: {
    'pages/guide/getting-started.md': 'index.md',
    'pages/:category/:page.md': ':category/:page.md',
  },
  head: [['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]],
  themeConfig: {
    logo: {
      src: '/logo.png',
      style: 'border-radius: 50%;height: 32px;width: 32px;',
    },
    siteTitle: 'number-correct',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },
    nav: [
      {
        text: pkg.version,
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/renzp94/number-correct/blob/main/CHANGELOG.md',
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renzp94/number-correct' },
    ],
    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是@renzp/number-correct?', link: '/guide/what-is' },
          { text: '快速开始', link: '/' },
        ],
      },
      {
        text: '比较',
        collapsed: false,
        items: [
          { text: 'compared 通用比较', link: '/compared/compared' },
          { text: 'isGreat 大于', link: '/compared/isGreat' },
          { text: 'isLess 小于', link: '/compared/isLess' },
          { text: 'isEqual 等于', link: '/compared/isEqual' },
          { text: 'isGreatEqual 大于等于', link: '/compared/isGreatEqual' },
          { text: 'isLessEqual 小于等于', link: '/compared/isLessEqual' },
        ],
      },
      {
        text: '计算',
        collapsed: false,
        items: [
          { text: 'divide 除法', link: '/math/divide' },
          { text: 'minus 减法', link: '/math/minus' },
          { text: 'mod 求余', link: '/math/mod' },
          { text: 'plus 加法', link: '/math/plus' },
          { text: 'times 乘法', link: '/math/times' },
        ],
      },
      {
        text: '其他',
        collapsed: false,
        items: [
          { text: 'toFixed 保留小数', link: '/other/toFixed' },
          { text: 'VNumber 链式类', link: '/other/VNumber' },
        ],
      },
    ],
    editLink: {
      pattern: 'https://github.com/renzp94/number-correct/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
  },
})
