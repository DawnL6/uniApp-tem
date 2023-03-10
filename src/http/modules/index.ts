import request from '../request'

/**
 * 模拟的网络请求 不存在真是的
 * @returns Promise
 */

/**请求入参 */
interface LoginParams {
  username: string
  password: string
}

/**请求成功返回数据 */
interface LoginReq {
  token: string
  id: number
}

/**
 * 登录方法
 */
export const login = (data: LoginParams) => {
  return request.post<LoginReq>('/user/login', data)
}

/**这里只是模拟调用登录 具体在页面中使用我就不展示了*/
login({
  password: '',
  /**如果类型错误都会有提示 */
  username: ''
}).then((res) => {
  console.log(res)
})
