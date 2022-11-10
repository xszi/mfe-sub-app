import './public-path.ts'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


import App from './App.vue'
import './registerServiceWorker'
import routes from './router'
import store from './store'
import plugins from './plugins'
import actions from '@/shared/actions'

let router: any = null
let instance: any = null

function render(props: any = {}) {
  instance = createApp(App)
  let container: any = null
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
    container = props.container;
    instance.config.globalProperties.parRouter = props.parRouter
    // const { proxy } = getCurrentInstance();
  }
  router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  
  instance
    .use(ElementPlus, { locale: zhCn })
    .use(store)
    .use(router)
    .use(plugins)
    .mount(container ? container.querySelector('#sub-app') : '#sub-app')
}

// 独立运行时
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  console.log('独立运行')
  render()
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}

export async function mount(props: any) {
  console.log('[vue] props from main framework', props)

  render(props)
}

export async function unmount() {
  instance.unmount();
  instance = null;
  router = null
}
