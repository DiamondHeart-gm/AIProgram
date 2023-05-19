// pages/history/history.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    recall(e) {
        const id = e.currentTarget.dataset.id
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
            mydata: {
                id
            }
        })
        wx.navigateBack({
            delta: 1
        })
    },
    onLoad(options) {
        const storageList = wx.getStorageSync('storageList')
        if (storageList.length === 0) return
        if (storageList?.length >= 7) {
            this.setData({
                list: storageList.slice(-7).sort(rank)
            })
            wx.setStorageSync('storageList', storageList.slice(-7))
            return
        }
        this.setData({
            list: storageList.sort(rank)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})

function rank(a, b) {
    const numA = Number((a.time.split(" ")[1]).split(":").join(""))
    const numB = Number((b.time.split(" ")[1]).split(":").join(""))
    return numA - numB
}