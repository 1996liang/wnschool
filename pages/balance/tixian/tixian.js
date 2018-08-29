// pages/balance/tixian/tixian.js
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
    this.setData({
      "userInfo": userInfo,
      balance: options.balance
    })
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
  getMsg: function (options) {
    this.setData({ value: options.detail.value });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jine: function () {
    this.setData({ value: this.data.balance });
  },
  send: function () {
    var that = this;
    if (this.data.balance == 0 || this.data.value == 0){
      console.log(123)
    }else if (this.data.balance >= this.data.value) {
      wx.showModal({
        "title": '提现',
        "content": "你确定要提现" + this.data.value + "元吗",
        "showCancel": true,
        success: function (res) {
          if (res.confirm) {
            that.request(that.data.value);
            wx.showToast({
              title: '提现申请成功',
              icon: 'success',
              duration: 2000,
              mask: true,
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      console.log(321)
    }
  },
  request:function(money){
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/tixian-save',
      data: {
        "tixian.user.id": that.data.userInfo.id,
        "tixian.money": money
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        
      }
    });
  }
})