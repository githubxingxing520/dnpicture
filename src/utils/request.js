export default (params) => {
  uni.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
    const baseUrl = 'http://157.122.54.189:9088'
    uni.request({
      ...params,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  })
}
