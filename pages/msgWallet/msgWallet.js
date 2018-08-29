// pages/msgWallet/msgWallet.js
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
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    console.log(userInfo);
    this.setData({
      "userInfo": userInfo
    });
    this.getMoney();
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
  ,
  order: function () {
    wx.redirectTo({
      url: '/pages/msgOrder/msgOrder',
    })
  },
  school: function () {
    wx.redirectTo({
      url: '/pages/msgSchool/msgSchool',
    })
  },
  return1: function () {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  getMoney() {
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/user-getUserCashFlow',
      data: {
        "user.id": that.data.userInfo.id
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // getUserCashFlow
        console.log(res);
        that.setData({ balance: res.data.balance });
        if (res.data.userCashFlow.length != 0) {
          console.log(res.data.userCashFlow.length)
          for (var i = 0; i < res.data.userCashFlow.length; i++) {
            var time = that.DateUtil(res.data.userCashFlow[i].createTime);
            var times = time.split("/");
            res.data.userCashFlow[i].createTime = times;
            if (res.data.userCashFlow[i].sendUserId == 0) {
              res.data.userCashFlow[i].avatarUrl = "/image/icon/wannengxiaoyuan.jpg";
              res.data.userCashFlow[i].cashFlow = "-" + res.data.userCashFlow[i].cashFlow;
              res.data.userCashFlow[i].msg = " 你提现了一笔钱";
            } else if (res.data.userCashFlow[i].fromUserId == 0) {
              res.data.userCashFlow[i].avatarUrl = "/image/icon/wannengxiaoyuan.jpg";
              res.data.userCashFlow[i].cashFlow = "+" + res.data.userCashFlow[i].cashFlow;
              res.data.userCashFlow[i].msg = res.data.userCashFlow[i].nickName + " 向你支付了一笔钱";
            } else {
              res.data.userCashFlow[i].cashFlow = "+" + res.data.userCashFlow[i].cashFlow;
              res.data.userCashFlow[i].msg = res.data.userCashFlow[i].nickName + " 向你支付了一笔钱";
            }
          }
          that.setData({ data: res.data.userCashFlow });
        } else {
          that.setData({ tishi: false });
        }
      }
    });
  },
  DateUtil: function (date) {
    var xianzai = new Date();
    var date = new Date(date);
    if (xianzai.getFullYear() == date.getFullYear() && xianzai.getMonth() == date.getMonth() && xianzai.getDate() == date.getDate()) {
      return "今天 /" + date.getHours() + ":" + date.getMinutes();
    } else {
      return date.getMonth() + 1 + " - " + date.getDate() + "/" + date.getHours() + ":" + date.getMinutes();
    }
  }
})