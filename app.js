import requestToken from "./utils/request"
App({

    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    async createToken() {
        wx.showLoading({
            title: '加载中',
        })
        const {
            code
        } = await wx.login()
        const res = await requestToken(code)
        if (res.success) {
            wx.setStorageSync('token', res.data)
            wx.hideLoading()
            wx.reLaunch({
              url: '/pages/index/index',
            })
        }
    },
    onLaunch: function () {
        const token = wx.getStorageSync('token')
        if (token) return
        this.createToken()
    },

    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {

    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function () {

    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function (msg) {

    }
})