// pages/my/my.js
Page({
  data: {
    "userInfo": null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    this.setData({
      "userInfo": userInfo
    });
    this.getMsg();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    wx.showLoading({
      "title": "加载中",
      "mask": true,
      "success": function () {
        setTimeout(function () {
          wx.stopPullDownRefresh();
          wx.hideLoading();
        }, 2000)
      }
    })

  },
  onShareAppMessage:function(){
    return {
      title: '无敌率真的超级帅哥的个人中心',
      path: '/pages/my/my',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  msg:function(){
    wx.navigateTo({
      'url':"/pages/msgOrder/msgOrder"
    })
  },
  qianbao:function(){
    wx.navigateTo({
      'url': "/pages/balance/balance"
    })
  },
  validation:function(){
    wx.navigateTo({
      'url': "/pages/validationStatus/validationStatus"
    })
  },
  we:function(){
    wx.navigateTo({
      url: '/pages/guanyuwomen/guanyuwomen',
    })
  },
  orderManager: function () {
    wx.navigateTo({
      url: "/pages/orderManager/orderManager",
    })
  },
  getMsg(){
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/user-getCount',
      data: {
        "user.id":that.data.userInfo.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.setData({"count":res.data});
      }
    });
  }

})