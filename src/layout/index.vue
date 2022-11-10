<template>
  <div :class="classObj" class="app-wrapper">
    layout
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <!-- <sidebar v-if="!isQIANKUN" class="sidebar-container" />
    <div class="main-container" :style="isQIANKUN ? { 'margin-left': 0 } : {}">
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
const sidebar = computed(() => {
  return this.$store.state.app.sidebar
})
const device = computed(() => {
  return this.$store.state.app.device
})
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
