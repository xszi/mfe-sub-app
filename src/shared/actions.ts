function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn('Current execute action is empty!111')
}

class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  }

  /**
     * 设置 actions
     */
  setActions(actions: any) {
    this.actions = actions
  }

  /**
     * 映射
     */
  onGlobalStateChange(this: any, ...args: any[]) {
    return this.actions && this.actions.onGlobalStateChange(...args)
  }

  /**
     * 映射
     */
  setGlobalState(this: any, ...args: any[]) {
    return this.actions && this.actions.setGlobalState(...args)
  }
}

const actions = new Actions()
export default actions
