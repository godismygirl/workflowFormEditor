import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  fastRefresh: true,
  layout: false,
  locale: {
    antd: true,
    default: 'zh-CN',
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  headScripts: [
    { src: './plugins/js/plugin.js' },
    { src: './luckysheet.umd.js' },
  ],
  links: [
    { href: './plugins/css/pluginsCss.css', rel: 'stylesheet' },
    { href: './plugins/plugins.css', rel: 'stylesheet' },
    { href: './css/luckysheet.css', rel: 'stylesheet' },
    { href: './assets/iconfont/iconfont.css', rel: 'stylesheet' },
  ],
  history: { type: 'hash' },
  hash: true,
  routes: [
    { path: '/login', title: '欢迎登录', component: '@/pages/Login' },

    {
      path: '/',
      component: '@/layouts/Security',
      routes: [
        {
          title: '移动端预览',
          path: '/mobile-preview',
          component: '@/pages/MobilePreview',
        },
        {
          title: '待我处理-移动端',
          path: '/mobile-todo',
          component: '@/pages/MobileTodo',
        },
        {
          title: '待我处理-web',
          path: '/web-todo-task',
          component: '@/pages/TodoTask',
        },
        {
          title: '待我处理详情-web',
          path: '/web-todo-detail',
          component: '@/pages/TodoTask/PortableDetail',
        },
        {
          title: '待我处理详情',
          path: '/mobile-todo-detail',
          component: '@/pages/MobileTodo/ActionModal',
        },
        {
          title: '我发起的-mobile',
          path: '/mobile-init',
          component: '@/pages/MobileInit',
        },
        {
          title: '我发起的-web',
          path: '/web-init-task',
          component: '@/pages/InitTask',
        },
        {
          title: '我发起的详情-mobile',
          path: '/mobile-init-detail',
          component: '@/pages/MobileInit/Detail',
        },
        {
          title: '我发起的详情-web',
          path: '/web-init-detail',
          component: '@/pages/InitTask/PortableDetail',
        },
        {
          title: '我已处理-mobile',
          path: '/mobile-done',
          component: '@/pages/MobileDone',
        },
        {
          title: '我已处理-web',
          path: '/web-done-task',
          component: '@/pages/DoneTask',
        },
        {
          title: '我已处理详情',
          path: '/mobile-done-detail',
          component: '@/pages/MobileInit/Detail',
        },
        {
          title: '抄送我的-mobile',
          path: '/mobile-copy',
          component: '@/pages/MobileCopy',
        },
        {
          title: '抄送我的-web',
          path: '/web-cc-task',
          component: '@/pages/CopyTask',
        },
        {
          title: '工作台',
          path: '/mobile-dashboard',
          component: '@/pages/MobileDashboard',
        },
        {
          title: '发起详情',
          path: '/mobile-start-detail',
          component: '@/pages/MobileDashboard/Detail',
        },
        {
          title: 'web-发起流程',
          path: '/web-start-task',
          component: '@/pages/Entry/PortableStart',
        },
        {
          title: 'web-打印预览',
          path: '/web-print-view',
          component: '@/pages/DoneTask/PrintBtn/PrintView',
        },
        {
          title: '应用设置',
          path: '/editor',
          component: '@/pages/Editor',
        },
        {
          title: '业务审批查询',
          path: '/web-flow-search',
          component: '@/pages/FlowSearchDetail',
        },
        {
          path: '/',
          component: '@/layouts/Basic',
          routes: [
            {
              title: '审核列表',
              path: '/dashboard',
              component: '@/pages/Dashboard',
            },
            {
              title: '待我处理',
              path: '/todo-task',
              component: '@/pages/TodoTask',
            },
            {
              title: '我已处理',
              path: '/done-task',
              component: '@/pages/DoneTask',
            },
            {
              title: '我发起的',
              path: '/init-task',
              component: '@/pages/InitTask',
            },
            {
              title: '抄送我的',
              path: '/cc-task',
              component: '@/pages/CopyTask',
            },
            {
              title: '流程管理',
              path: '/entry',
              component: '@/pages/Entry',
            },
            {
              title: '流程查询',
              path: '/flow-search',
              component: '@/pages/FlowSearch',
            },
            {
              title: '业务审批查询',
              path: '/flow-search-detail',
              component: '@/pages/FlowSearchDetail',
            },
            { path: '/*', component: '@/pages/404' },
          ],
        },
      ],
    },
  ],
  npmClient: 'yarn',
  proxy: {
    '/API': {
      target: 'http://develop.fireyu.com:9011',
      //target: 'http://192.168.1.178:49004',
      changeOrigin: true,
      pathRewrite: { '^/API': '' },
    },
    '/PROD': {
      target: 'http://192.168.1.178:49006/',
      //target: 'http://192.168.1.77:49006',
      changeOrigin: true,
      pathRewrite: { '^/PROD': '' },
    },
    '/FILE': {
      target: 'http://192.168.1.178:49007/',
      //target: 'http://192.168.1.55:49007/',
      changeOrigin: true,
      pathRewrite: { '^/FILE': '' },
    },
    '/PREVIEW': {
      target: 'http://192.168.1.179:8012/',
      //target: 'http://192.168.1.45:49007/',
      changeOrigin: true,
      //pathRewrite: { '^/preview': '' },
    },
  },
});
