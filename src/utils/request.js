import axios from 'axios'
import { ElMessage } from 'element-plus'

export const baseUrl =
  process.env.NODE_ENV === 'development' ? '/so/api' : 'http://139.159.245.209/so/api/'

// const origin = window.location.origin
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 600000
})

instance.interceptors.request.use(
  (request) => {
    const token = localStorage.token ? JSON.parse(localStorage.token) : {}
    request.headers = {
      // Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiY2oiLCJ1aWQiOjEwMywiY3JlYXRlVGltZSI6MTYyNDYwNjc2OCwiY2xpZW50SXAiOiIxOTIuMTY4LjAuMjgiLCJleHRlbmRUb2tlbiI6IiJ9.ZGLjtDkkDcFJm6XJZFuCCLHYQiHxBnerlmFzvK3xTQs",
      Authorization: token.authorization || '',
      'Content-Type': 'application/json'
    }
    return request
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    if (response.data.code === -2) {
      // token失效
      ElMessage({
        message: '登录失效请重新登录',
        type: 'warning'
      })
      localStorage.clear() // 清除缓存
      window.location.href = '/'
      return false
    }
    if (response.data.code === -1 && response.data.message === 'Token invalid') {
      // token失效
      ElMessage({
        message: '登录失效请重新登录',
        type: 'warning'
      })
      localStorage.clear() // 清除缓存
      window.location.href = '/'
      return false
    }
    if (response.data.code === 200 || response.data.code === 0) {
      // 天气接口code=0 成功
      return response.data
    }
    return Promise.reject(new Error(response.data.message))
  },
  (error) => {
    const errorString = error.toString()

    if (errorString.includes('Token invalid')) {
      // token失效
      ElMessage({
        message: '身份认证无效，请重新登录',
        type: 'warning'
      })
      localStorage.clear() // 清除缓存
      window.location.href = '/'
      return false
    }

    if (errorString.includes('timeout')) {
      return Promise.reject(new Error('接口请求超时'))
    }

    if (error.response.status >= 500) {
      ElMessage.error('请求失败，服务器异常')
    }
    return Promise.reject(error.response.data.message)
  }
)

const request = (url, options = {}) => {
  // post 请求  ||  digital = true => 数字信息子系统  rest接口风格 get请求     options.digital
  if (options.method == 'post') {
    return instance
      .request({
        url,
        ...options
      })
      .catch((err) => {
        ElMessage.error(err.message)
      })
  }
  // 乡村治理 便民服务  get请求
  return instance
    .request(url, {
      params: { ...options.data }
    })
    .catch((err) => {
      ElMessage.error(err.message)
    })
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
export default request
