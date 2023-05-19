export default (code) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: "https://www.campuscloud.top/api/login/creatToken",
            method: "POST",
            header: {
                js_code: code
            },
            success: (res) => {
                resolve(res.data)
            }
        })
    })
}