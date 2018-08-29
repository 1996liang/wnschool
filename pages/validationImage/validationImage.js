// pages/validationImage/validationImage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation1: {},
    "hiddent": true,
    "Hidden": false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var zi = options.zi;
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    this.setData({
      "userInfo": userInfo,
      zi:zi
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  Image: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({ Image: res.tempFilePaths[0], Hidden: true });
      },
    })
  },
  upload: function () {
    var that = this;
    wx.uploadFile({
      url: 'https://api.wnschool.cn/validation-upload',
      filePath: that.data.Image,
      name: 'file',
      success: function (options1) {
        var imageUrl = JSON.parse(options1.data).imageUrl;
        that.setData({ imageUrl: imageUrl});
        that.request();
      },
      fail: function (options) {
        console.log(options)
      }
    })
  }, 
  request:function(){
    var that = this;
    console.log(that.data.imageUrl)
    wx.request({
      url: 'https://api.wnschool.cn/lootValidation-updateValidation',
      data: {
        "user.id": that.data.userInfo.id,
        "image": that.data.imageUrl
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: '/pages/validationStatus/validationStatus',
        })
      }
    });
  },
  submit:function(){
    this.upload();
  }
})