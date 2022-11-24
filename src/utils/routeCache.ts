import emitter from '@/utils/mittBus'
import { _RouteLocationBase, RouteLocationNormalized } from 'vue-router'
export interface ITagView extends Partial<RouteLocationNormalized> {
  title?: string
  to?: _RouteLocationBase
}
// function addView(view: any) {
//   addVisitedView(view)
//   addCachedView(view)
// }

export const addVisitedViewCache = (view: ITagView) => {
  const visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
  if (visitedViews.some((v: any) => v.path === view.path)) return
  visitedViews.push(
    Object.assign({}, view, {
      title: view.meta?.title || 'no-name'
    })
  )
  sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
  emitter.emit('updateVisitedViews')
}

export const delVisitedViewCache = (view: ITagView) => {
  const visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
  for (const [i, v] of visitedViews.entries()) {
    if (v.path === view.path) {
      visitedViews.splice(i, 1)
      break
    }
  }
  sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
  emitter.emit('updateVisitedViews')
}

// function addVisitedView(view: any) {
//   // 使用类型断言，告诉编译器他是什么类型
//   const visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
//   if (visitedViews.some((v: any) => v.fullPath === view.fullPath)) return
//   const findIndex = visitedViews.findIndex((v: any) => v.name === view.name)
//   if (findIndex >= 0) {
//     visitedViews.splice(findIndex, 1)
//   }
//   const handleView = {
//     name: view.name,
//     path: view.path,
//     query: view.query,
//     params: view.params,
//     fullPath: view.fullPath,
//     childApp: view.childApp ? view.childApp : 'v2-sub-app',
//     title: view.meta.title,
//     noCache: view.meta.noCache
//   }
//   visitedViews.push(handleView)
//   EventBus.$emit('setRouteCache', visitedViews)
//   sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
// }

// function addCachedView(view: any) {
//   const cachedViews = JSON.parse(<string>sessionStorage.getItem('cachedViews'))
//   if (cachedViews.includes(view.name)) return
//   if (!view.meta.noCache) {
//     cachedViews.push(view.name)
//   }
//   sessionStorage.setItem('cachedViews', JSON.stringify(cachedViews))
// }

// function delView(view: any) {
//   delVisitedView(view)
//   delCachedView(view)
// }

// function delVisitedView(view: any) {
//   const visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
//   for (const [i, v] of visitedViews.entries()) {
//     if (v.path === view.path) {
//       visitedViews.splice(i, 1)
//       break
//     }
//   }
//   sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
// }

// function delCachedView(view: any) {
//   const cachedViews = JSON.parse(<string>sessionStorage.getItem('cachedViews'))
//   const index = cachedViews.indexOf(view.name)
//   index > -1 && cachedViews.splice(index, 1)
//   sessionStorage.setItem('cachedViews', JSON.stringify(cachedViews))
// }

// function delOthersViews(view: any) {
//   delOthersVisitedViews(view)
//   delOthersCachedViews(view)
// }

// function delOthersVisitedViews(view: any) {
//   let visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
//   visitedViews = visitedViews.filter((v: any) => {
//     return v.meta.affix || v.path === view.path
//   })
//   sessionStorage.setItem('visitedViews', visitedViews)
// }

// function delOthersCachedViews(view: any) {
//   let cachedViews = JSON.parse(<string>sessionStorage.getItem('cachedViews'))
//   const index = cachedViews.indexOf(view.name)
//   if (index > -1) {
//     cachedViews = cachedViews.slice(index, index + 1)
//   } else {
//     // if index = -1, there is no cached tags
//     cachedViews = []
//   }
//   sessionStorage.setItem('cachedViews', cachedViews)
// }

// function updateVisitedView(view: any) {
//   const visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
//   for (let v of visitedViews) {
//     if (v.path === view.path) {
//       v = Object.assign(v, view)
//       break
//     }
//   }
//   sessionStorage.setItem('visitedViews', visitedViews)
// }
