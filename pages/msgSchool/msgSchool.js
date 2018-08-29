// pages/msgSchool/msgSchool.js
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
    this.getSchool();
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
  order: function () {
    wx.redirectTo({
      url: '/pages/msgOrder/msgOrder',
    })
  },
  wallet: function () {
    wx.redirectTo({
      url: '/pages/msgWallet/msgWallet',
    })
  }
  ,
  return1: function () {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  tiaozhuan:function(options){
    console.log(options.currentTarget.dataset.index);
    var index = options.currentTarget.dataset.index;
    var that= this;
    wx.navigateTo({
      url: '/pages/schoolcircleDetail/schoolcircleDetail?id=' + that.data.msg[index].schoolCircleCommentId,
    })
  },
  getSchool() {
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/schoolCircle-getUserSchoolCircleMsg',
      data: {
        "user.id": that.data.userInfo.id
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.schoolcircle.length > 0) {
          for (var i = 0; i < res.data.schoolcircle.length; i++) {
            var time = util.formatTime(res.data.schoolcircle[i].createTime);
            res.data.schoolcircle[i].createTime = time;
            if (res.data.schoolcircle[i].content.length>50){
              res.data.schoolcircle[i].content = res.data.schoolcircle[i].content.substring(0,50)+"......";
            }
          }
          that.setData({ msg: res.data.schoolcircle});
        }
      }
    })
  }
})