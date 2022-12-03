const bucket = new WeakMap()
function track(target, key) {
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    const effectsToRun = new Set()
    // 触发的副作用函数与正在执行的副作用函数相同，则不触发执行
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        if(effectFn.options.scheduler){
            // console.log(999, effectFn.options.scheduler);
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
}
function cleanup(effectFn) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

let activeEffect // 只有一个暂存函数，嵌套时会被里层的副作用函数覆盖掉, 这时只暂存一个激活的副作用函数
const effectStack = []
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        const res = fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
    effectFn.options = options // 调度函数
    effectFn.deps = []
    if (!options.lazy) {
        effectFn()
    }
    return effectFn
}

function log(str) {
    console.log(str);
}