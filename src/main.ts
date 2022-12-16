import './public-path.ts'
import { createApp, Directive } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import mitt from 'mitt'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import store from './store'
import { constantRoutes } from './router'
// import { loadAllPlugins } from './plugins'
import '@/styles/index.scss'
import 'normalize.css'
import * as directives from '@/directives'
import loadSvg from '@/icons'
import actions from '@/shared/actions'

let router: any = null
let instance: any = null

function render(props?: any) {
  instance = createApp(App)
  router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
  })
  actions.setActions(props)
  // // 加载所有插件
  // loadAllPlugins(instance)
  // 加载全局 SVG
  loadSvg(instance)
  // 自定义指令
  Object.keys(directives).forEach((key) => {
    instance.directive(key, (directives as { [key: string]: Directive })[key])
  })
  let container: any = null
  if (props) {
    // 注入 actions 实例
    container = props.container
    instance.config.globalProperties.$parRouter = props.parRouter
    sessionStorage.setItem('sign_frame_token', props.token)
    instance.config.globalProperties.$eventbus = mitt()
    // const { proxy } = getCurrentInstance();
  }

  instance
    .use(ElementPlus, { locale: zhCn })
    .use(store)
    .use(router)
    .mount(container ? container.querySelector('#sub-app') : '#sub-app')
}

// 独立运行时
// eslint-disable-next-line no-underscore-dangle
if (!(window as any).__POWERED_BY_QIANKUN__) {
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
  instance.unmount()
  instance = null
  router = null
}
