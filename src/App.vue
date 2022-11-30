<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { useAppStore } from '@/store/modules/app'
import { computed, onMounted } from 'vue'
import actions from '@/shared/actions'

const locale = zhCn // element-plus 设置为中文

const ISQIANKUN = computed(() => {
  return (window as any).__POWERED_BY_QIANKUN__
})

onMounted(() => {
  if (!ISQIANKUN.value) {
    const visitedViews = JSON.parse(sessionStorage.getItem('visitedViews') as string)
    if (!visitedViews) {
      sessionStorage.setItem('visitedViews', JSON.stringify([]))
    }
  }
  actions.onGlobalStateChange(
    (state: any, prevState: any) => {
      console.log(prevState, state, 'xxxx')
    }
  )
})

useAppStore().initTheme() // 初始化 Theme
</script>
