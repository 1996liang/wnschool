// pages/msgOrder/msgOrder.js
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
    })
    this.getOrderStatusAndFinishTime();
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
  
  },
  wallet:function(){
    wx.redirectTo({
      url: '/pages/msgWallet/msgWallet',
    })
  },
  school: function () {
    wx.redirectTo({
      url: '/pages/msgSchool/msgSchool',
    })
  },
  return1:function(){
    // getOrderStatusAndFinishTime
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  getOrderStatusAndFinishTime:function(){
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/order-getOrderStatusAndFinishTime',
      data: {
          "user.id":that.data.userInfo.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.length != 0) {
          for (var i = 0; i < res.data.length; i++) {
            var time = util.formatTime(res.data[i][0]);
            res.data[i][0] = time;
            var status = res.data[i][1];
            res.data[i][1] = that.getArray(status);
          }
          that.setData({ data: res.data });
        } else {
          that.setData({ tishi: false });
        }
      }
    });
  },
  getArray:function(i){
      var s0="您的订单正在等待接单中"
      var s1 = "您的订单已经被承接,请督促承接人完成订单";
      var s2 = "承接人已完成订单，请确认订单";
      var s3 = "您的订单已完成，祝您生活愉快";
      var a = new Array();
      switch(i){
        case 1:
          a.push(s0);
          break;
        case 2:
          a.push(s0);
          a.push(s1);
          break;
        case 3:
          a.push(s0);
          a.push(s1);
          a.push(s2);
          break;
        case 4:
          a.push(s0);
          a.push(s1);
          a.push(s2);
          a.push(s3);
          break;
      }
      return a;
  }
})