/**这里假设后端接口返回的请求体是这样的
 * 这里的T主要是泛型 各个接口的返回体是不一样的 具体接口需要具体单独写
 */
interface ResponseTypes<T> {
  code: string
  msg: string
  data: T
  success: boolean
}

/**统一的错误处理 */
interface ResponseErrorType {
  /**
   * 这里的异常错误码可以根据自己的业务场景自定义 这里只是简单的示例下
   * 1 业务异常
   * 2 http异常
   * 3 fail系统异常
   */
  type: 1 | 2 | 3
  /**后端返回的code码 如果状态码不是200 就是null*/
  code: number | null
  /**http状态码 如果是业务异常 这个状态码是200*/
  statusCode: number | null
  /**消息提示 错误消息提示 如果有业务返回的就是业务返回的 其它自定义 */
  msg: string
}

const request = <T>(config: UniApp.RequestOptions) => {
  const url = import.meta.env.VITE_REQUEST_BASE_URL

  const header = {
    /**这里只是假设下后端接口的认证信息是通过header交互的 具体的还要以自己的业务场景来处理 */
    token: uni.getStorageSync('token')
  }

  return new Promise((reslove: (value: T) => void, reject: (reason: any) => void) => {
    uni.request({
      ...config,
      url,
      timeout: config.timeout || 60000,
      header: {
        ...header,
        ...config.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data: ResponseTypes<T> = res.data as ResponseTypes<T>
          /**后端状态码 是 '0'的情况下 业务正常直接返回data结果
           * 这个状态也是假设的 具体的业务自己处理
           */
          if (data.success && data.code === '0') {
            reslove(data.data)
            return
          }

          uni.showToast({
            title: data.msg,
            icon: 'none'
          })

          const errorData = {
            type: 1,
            code: data.code,
            statusCode: res.statusCode,
            msg: data.msg,
            data: data
          }

          reject(errorData)
        } else {
          reject({
            type: 2,
            code: null,
            statusCode: res.statusCode,
            msg: '服务器异常，请联系管理员'
          })
        }
      },
      fail: (result) => {
        reject({
          type: 3,
          code: null,
          statusCode: null,
          msg: result.errMsg
        })
      }
    })
  })
}
export default {
  /**
   * get请求
   * @param url 请求地址
   * @param data 请求的参数
   * @param options 其他请求配置
   */
  get: <T = any>(url: string, data?: UniApp.RequestOptions['data'], options?: Partial<UniApp.RequestOptions>) => {
    return request<T>({
      ...options,
      url,
      data,
      method: 'GET'
    })
  },
  /**
   * post请求
   * @param url 请求地址
   * @param data 请求的参数
   * @param options 其他请求配置
   */
  post: <T = any>(url: string, data?: UniApp.RequestOptions['data'], options?: Partial<UniApp.RequestOptions>) => {
    return request<T>({
      ...options,
      url,
      data,
      method: 'POST'
    })
  }
}
