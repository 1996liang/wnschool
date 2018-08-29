// pages/validationStatus/validationStatus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    this.setData({
      "userInfo": userInfo
    })
    if (options.msg == "student") {
      that.setData({ iconType: "info", title: "缺少图片", content: "你还缺一张学生证信息页没有上传,\n请在24小时内上传", button: "继续认证" })
    } else if (options.msg == "idCard") {
      that.setData({ iconType: "info", title: "缺少图片", content: "你还缺一张身份证信息页没有上传,\n请在24小时内上传", button: "继续认证" })
    } else {
      this.getMsg();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  return1:function(){
    wx.navigateBack({
      delta:1
    })
  },
  redirect: function () {
    var button = this.data.button;
    if (button == "重新认证") {
      wx.redirectTo({
        url: '/pages/validation/validation',
      })
    } else if (button == "返回") {
      wx.switchTab({
        url: '/pages/my/my',
      })
    } else if (button == "继续认证") {
      var zi = "";
      if (this.data.content == "你还缺一张学生证信息页没有上传") {
        zi = "学生证";
      } else if (this.data.content == "你还缺一张身份证信息页没有上传") {
        zi = "身份证";
      }
      wx.redirectTo({
        url: '/pages/validationImage/validationImage?zi='+zi,
      })
    }
  },
  getMsg: function () {
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/lootValidation-getValidationImage',
      data: {
        "user.id": that.data.userInfo.id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data == "student not upload") {
          that.setData({ iconType: "info", title: "缺少图片", content: "你还缺一张学生证信息页没有上传", button: "继续认证" })
        } else if (res.data == "idCard not upload") {
          that.setData({ iconType: "info", title: "缺少图片", content: "你还缺一张身份证信息页没有上传", button: "继续认证" })
        } else if (res.data == "-1") {
          wx.redirectTo({
            url: '/pages/validation/validation',
          })
        } else if (res.data == "0") {
          that.setData({ iconType: "warn", title: "认证失败", content: "由于你上传的资料有误，认证失败，\n点击下方重新认证", button: "重新认证" })
        } else if (res.data == "1") {
          that.setData({ iconType: "waiting", title: "正在认证", content: "你的信息正在认证中,请等候一个工作日，\n由后台人员为您审核", button: "返回" })
        } else if (res.data == "2") {
          that.setData({ iconType: "success_no_circle", title: "实名认证成功", content: "你已经实名认证成功，可以开始接单了", button: "返回" })
        }
      }
    });
  },
})