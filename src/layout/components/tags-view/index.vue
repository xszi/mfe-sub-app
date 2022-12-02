<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper">
      <router-link
        v-for="tag in state.visitedViews"
        ref="tag"
        :key="tag.path"
        :class="state.isActive(tag) ? 'active' : ''"
        :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
        class="tags-view-item"
        @click.middle="!state.isAffix(tag) ? state.closeSelectedTag(tag) : ''"
      >
        {{ tag.meta?.title }}
        <el-icon
          v-if="(!state.isAffix(tag) && state.visitedViews.length > 1)"
          :size="12"
          @click.prevent.stop="state.closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
  </div>
</template>

<script lang="ts" setup>
import mitter from '@/utils/mittBus'
import path from 'path'
import { addVisitedView, delVisitedView } from '@/utils/routeCache'
import { useTagsViewStore, ITagView } from '@/store/modules/tags-view'
import { usePermissionStore } from '@/store/modules/permission'
import { computed, getCurrentInstance, nextTick, onBeforeMount, onUnmounted, reactive, watch } from 'vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import ScrollPane from './scroll-pane.vue'
import { Close } from '@element-plus/icons-vue'
import actions from '@/shared/actions'

const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const router = useRouter()
const instance = getCurrentInstance()
const currentRoute = useRoute()
// const { proxy } = instance as any

const toLastView = (visitedViews: ITagView[], view: ITagView) => {
  const latestView = visitedViews.slice(-1)[0]

  if (latestView !== undefined && latestView.fullPath !== undefined) {
    router.push(latestView.fullPath).catch((err) => {
      console.warn(err)
    })
  } else {
    // 如果没有 tags-view，请默认重定向到主页，如果你需要，可以自行调整它
    if (view.name === 'Dashboard') {
      // 重新加载主页
      router.push({ path: '/redirect' + view.fullPath }).catch((err) => {
        console.warn(err)
      })
    } else {
      router.push('/').catch((err) => {
        console.warn(err)
      })
    }
  }
}

const updateVisitedViews = () => {
  state.visitedViews = JSON.parse(sessionStorage.getItem('visitedViews') as string)
  actions.setGlobalState({ visitedViews: state.visitedViews })
}

mitter.on('updateVisitedViews', updateVisitedViews)

onUnmounted(() => {
  mitter.off('foo', updateVisitedViews)
})

const state = reactive({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: {} as ITagView,
  affixTags: [] as ITagView[],
  visitedViews: [] as ITagView[],
  isActive: (route: ITagView) => {
    return route.path === currentRoute.path
  },
  isAffix: (tag: ITagView) => {
    return tag.meta && tag.meta.affix
  },
  refreshSelectedTag: (view: ITagView) => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({ path: '/redirect' + fullPath }).catch((err) => {
        console.warn(err)
      })
    })
  },
  closeSelectedTag: (view: ITagView) => {
    delVisitedView(view)
    if (state.isActive(view)) {
      const visitedViews = JSON.parse(sessionStorage.getItem('visitedViews') as string)
      toLastView(visitedViews, view)
    }
  }
})

const routes = computed(() => permissionStore.routes)

const filterAffixTags = (routes: RouteRecordRaw[], basePath = '/') => {
  let tags: ITagView[] = []

  routes?.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }

    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      if (childTags.length >= 1) {
        tags = tags.concat(childTags)
      }
    }
  })
  return tags
}

const initTags = () => {
  state.affixTags = filterAffixTags(routes.value)
  for (const tag of state.affixTags) {
    // 必须含有 name 属性
    if (tag.name) {
      addVisitedView(tag as ITagView)
    }
  }
}

const addTags = () => {
  if (currentRoute.name) {
    addVisitedView(currentRoute)
  }
  return false
}

const moveToCurrentTag = () => {
  const tags = instance?.refs.tag as any[]
  if (tags === null || tags === undefined || !Array.isArray(tags)) {
    return
  }
  for (const tag of tags) {
    if ((tag.to as ITagView).path === currentRoute.path) {
      // When query is different then update
      if ((tag.to as ITagView).fullPath !== currentRoute.fullPath) {
        tagsViewStore.updateVisitedView(currentRoute)
      }
    }
  }
}

watch(
  () => currentRoute.name,
  () => {
    addTags()
    moveToCurrentTag()
  }
)

// life cricle
onBeforeMount(() => {
  initTags()
  addTags()
  updateVisitedViews()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 #00000010, 0 0 3px 0 #00000010;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
      .el-icon {
        margin: 0 2px;
        vertical-align: middle;
        border-radius: 50%;
        &:hover {
          background-color: #00000030;
          color: #fff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 #00000030;
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
