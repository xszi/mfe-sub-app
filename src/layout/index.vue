<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="!isQIANKUN" class="sidebar-container" />
    <!--<div class="main-container" :style="isQIANKUN ? { 'margin-left': 0 } : {}">
      <div v-if="!isQIANKUN" :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <tags-view v-if="needTagsView" />
      <app-main />
    </div> -->
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const isQIANKUN = computed(() => {
  return window.__POWERED_BY_QIANKUN__
})
const sidebar = computed(() => {
  return store.state.app.sidebar
})
const device = computed(() => {
  console.log(store.state.app.device, 'xxx')
  return store.state.app.device
})
const handleClickOutside = () => {
  store.dispatch('app/closeSideBar', { withoutAnimation: false })
}
const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.opened,
    openSidebar: sidebar.opened,
    withoutAnimation: sidebar.withoutAnimation,
    mobile: device === 'mobile'
  }
})
</script>
<style scoped>
.home {
  padding: 10px;
}
</style>
