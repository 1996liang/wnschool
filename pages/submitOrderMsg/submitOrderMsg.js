// pages/submitOrderMsg/submitOrderMsg.js
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
  
  uploadImage:function (options, userInfo, successTime) {
    var that = this;
    wx.uploadFile({
      url: 'https://api.wnschool.cn/order-upload',
      filePath: that.data.image,
      name: 'file',
      success: function (options1) {
        console.log(options1)
        var images = that.data.imagesUrl;
        var o = JSON.parse(options1.data).imageUrl;
        images.push(o);
        that.setData({ imagesUrl: images });
        that.check(options, userInfo, successTime);
      },
      fail: function (options) {
        console.log(options)
      }
    })
  },
  submit: function (options, userInfo, successTime) {
    console.log(userInfo)
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/order-orderSave',
      data: {
        "user.id": userInfo.id,
        "orderPrivate.phoneNumber": options.detail.value.phoneNumber,
        "orderPrivate.contactName": options.detail.value.contactName,
        "orderPrivate.weChatNumber": options.detail.value.weChatNumber,
        "orderTalk.content": options.detail.value.privateTalk,
        "orderTalk.hostId": userInfo.id,
        "orderPrivate.imageUrl": that.data.imagesUrl.toString(),
        content: options.detail.value.content,
        money: options.detail.value.money,
        orderType: options.detail.value.orderType,
        sex: parseInt(options.detail.value.sex),
        successTime: successTime,


      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data == "success") {
          wx.showToast({
            title: '发布成功',
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: "/pages/run/run",
                })
              }, 1000);
            }
          })
        }
      }
    })
  },
})