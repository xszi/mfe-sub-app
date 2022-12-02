import emitter from '@/utils/mittBus'
import { _RouteLocationBase, RouteLocationNormalized } from 'vue-router'
import actions from '@/shared/actions'
export interface ITagView extends Partial<RouteLocationNormalized> {
  title?: string
  to?: _RouteLocationBase
}

export const addVisitedView = (view: ITagView) => {
  const visitedViews = JSON.parse(<string>sessionStorage.getItem('visitedViews'))
  if (visitedViews.some((v: any) => v.path === view.path)) return
  visitedViews.push(
    Object.assign({}, view, {
      title: view.meta?.title || 'no-name'
    })
  )
  sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
  emitter.emit('updateVisitedViews')
  actions.setGlobalState({ visitedViews }, { childApp: 'v3-sub-app' })
}

export const delVisitedView = (view: ITagView) => {
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
