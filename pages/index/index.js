import {
    baseURL
} from "../../utils/config"
import {
    getSystemHeaderHeight,
    uuid
} from "../../utils/method"
import {
    formatTime
} from "../../utils/util"
let socketOpen = false
let socketPush = false
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: "", //输入框的值
        questions: [],
        loading: false,
        scrollBottom: "",
        article: {},
        barHeight: 0,
        showPopup: false,
        uuid: ""
    },

    showPopup() {
        this.setData({
            showPopup: true
        })
    },
    onClose() {
        this.setData({
            showPopup: false
        })
    },
    bindinput() {},
    sendTopic() {
        this.setData({
            loading: true
        })
        if (socketOpen) {
            wx.sendSocketMessage({
                data: JSON.stringify({
                    messages: [...this.data.questions, {
                        "role": "user",
                        "content": this.data.value
                    }, ]
                }),
                success: (res) => {
                    socketPush = true
                    this.setData({
                        questions: [...this.data.questions, {
                            role: "user",
                            content: this.data.value
                        }],
                        value: ""
                    })
                },
                fail:(error)=>{
                    console.log("socket发送消息失败");
                }
            })
        }else{
            console.log("socket未连接");
        }

    },
    updateQuestion(result) {
        // 刚生成
        if (socketPush) {
            this.setData({
                questions: [...this.data.questions, {
                    role: "assistant",
                    content: result.data,
                }],
                loading: false,
                scrollBottom: "scrollBottom"
            })
            socketPush = false
            return
        }
        // 已经生成了，往里面添加
        let questions = JSON.parse(JSON.stringify(this.data.questions))
        if (questions.length > 0) {
            questions[questions.length - 1].content = questions[questions.length - 1].content + result.data
            if (questions.length >= 7) {
                questions.shift()
                questions.shift()
            }
            this.setData({
                questions,
                scrollBottom: "scrollBottom"
            })
        }
    },
    connectSocket() {
        wx.connectSocket({
            url: `wss://${baseURL}/api/v1/chat`,
            header: {
                authorization: wx.getStorageSync('token')
            }
        })
    },
    onLoad: function (options) {
        const height = getSystemHeaderHeight()
        const token = wx.getStorageSync('token')
        token && this.connectSocket()
        this.setData({
            barHeight: height * 2
        })
        wx.onSocketOpen((result) => {
            socketOpen = true
            console.log("socket连接成功,index");
            this.setData({
                uuid: uuid()
            })
        })
        wx.onSocketMessage((result) => {
            // token过期
            if (result.data.includes(`"code":403`)) {
                app.createToken()
                this.connectSocket()
                return
            }
            if (result.data === "[DONE]") {
                return
            }
            this.updateQuestion(result)

        })
    },

    onShow: function () {
        // 如果是提交状态返回isRefresh=1，才刷新页面，从详情过来无需刷新
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        // console.log(currPage.__data__.mydata);//此处既是上一页面传递过来的值
        if (currPage.__data__.mydata && currPage.__data__.mydata.id) {
            const id = currPage.__data__.mydata.id
            const storageList = wx.getStorageSync('storageList')
            const list = storageList.filter(item => item.id === id)
            this.setData({
                questions: list[0].q,
                uuid: id
            })
            currPage.__data__.mydata.id = ''
        }
    },
    onHide: function () {
        const currentQuestions = JSON.parse(JSON.stringify(this.data.questions))
        if (currentQuestions.length === 0) {
            this.setData({
                showPopup: false
            })
            return
        }
        const currentUUID = this.data.uuid
        const storageList = wx.getStorageSync('storageList')
        let list = []
        if (storageList && storageList.length > 0) {
            list = JSON.parse(JSON.stringify([...list, ...storageList.filter(item => item.id !== currentUUID)]))
            console.log(list);
        }
        list.push({
            id: currentUUID,
            time: formatTime(new Date()),
            q: currentQuestions
        })
        wx.setStorageSync('storageList', JSON.parse(JSON.stringify(list)))
        this.setData({
            showPopup: false
        })
    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    }
})