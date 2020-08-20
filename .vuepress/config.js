const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const createREADME = require('../scripts/createREADME')

const resolve = (...args) => {
  return path.resolve(__dirname, ...args)
}

const sidebar = {}

/**
 * @name 获取侧边栏，通过传入菜单获取
 * 传入文件名字，将会读取文件夹名字
 * @param {String} dirname 
 * 示例：getFile('Vue')
 */
function getSidebar(menuArr) {
  menuArr.forEach(item => {
    sidebar[item.link] = [{
      title: item.text,
      collapsable: false,
      children: getFile(item.text)
    }]
  })
}

/**
 * 传入文件名字，将会读取文件夹名字
 * @param {String} dirname 
 * 示例：getFile('Vue')
 */
function getFile(dirname) {
  // 获取文件夹里面的所有文件
  let arr = fs.readdirSync(resolve('..', 'src', 'web前端', dirname))
  // 去除README和文件夹
  arr = arr.filter(item => (!item.includes('README') && item.includes('.')))
  return arr.map(item => item.replace(/\.md/, ''))
}

/**
 * @name 通过传入的name名字去src获取对应的文件夹，并转换为menu下拉菜单
 * @param {String} dirname 
 * @return [{text: dirname, link: '/src/dirname'}]
 */
function byDirNameGetMenu(dirname) {
  let arr = fs.readdirSync(resolve('..', 'src', dirname))
  return arr.map(item => ({ text: item, link: `/src/${dirname}/${item}/` }))
}

// 通过文件夹获取菜单
const webItems = byDirNameGetMenu('web前端')
// 获取web前端的左侧的sidebar
getSidebar(webItems)
// 生成首页README.md的目录
createREADME('web前端')

module.exports = {
  title: '前端学习',
  description: '不断学习，不断成长！',
  // theme: require.resolve('./theme/'),
  head: [
    ['link', { rel: 'icon', type: "image/x-icon", href: 'https://www.qfxlw.com/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    // ['meta', {'http-equiv': "Content-Security-Policy", content: "default-src 'self' *.qfxlw.com; style-src *; img-src *"}],
    // ['script', {src: 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'}],
    // ['script', {}, shell.cat(resolve('sharewx.js'))],
    // ['script', {}, 'shareWeixin()'],
    ['script', {}, shell.cat(resolve('./share/hm.js'))],
  ],
  plugins: [
    // ['@vuepress/pwa', {
    // 		serviceWorker: true,
    // 		updatePopup: true
    // 	}
    // ],
    ['@vssue/vuepress-plugin-vssue', {
      // 设置 `platform` 而不是 `api`
      platform: 'github',
      locale: 'zh-CN',

      // 其他的 Vssue 配置
      owner: '1256807020',
      repo: 'qfxlwblog',
      clientId: '7a41e319184641badae9',
      clientSecret: 'aeed275523a77aebf373fbfedf101ac2d0ba6747',
    }
    ],
    require('./plugin/copy'),
    // [
    //   'vuepress-plugin-comment',
    //   {
    //     choosen: 'valine', 
    //     // options选项中的所有参数，会传给Valine的配置
    //     options: {
    //       el: '#valine-vuepress-comment',
    //       appId: 'Your own appId',
    //       appKey: 'Your own appKey'
    //     }
    //   }
    // ]
    // require('./reading-progress')
  ],
  themeConfig: {
    repo: '1256807020/qfxlwblog',
    repoLabel: 'GitHub',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '在GitHub上编辑此页',
    lastUpdated: '上次更新：', // 前缀使用
    // smoothScroll: true,
    algolia: {
      apiKey: '75033b31cce2d60aef3adfe4df1dbb4c',
      indexName: 'qfxlwblog'
    },
    nav: [
      { text: 'home', link: '/' },
      { text: 'web前端', items: webItems },
      {
        text: '功能',
        items: [
          // {text: '自定义页面', link: '/custom/'},
          { text: '消息传输站', link: 'https://www.qfxlw.com' }
        ]
      }
      // { text: '编辑器', link: '/src/editor/' }
    ],
    sidebarDepth: 2,  //仅支持h2和h3标题
    sidebar
  }
}
// 优秀的文章
// https://zhb333.github.io/readme-blog/2020/03/21/vuepress%E5%BC%80%E5%8F%91%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2/
