// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      starImage: "/image/icon/evaluate-empty.png",
      starLightImage: "/image/icon/evaluate-light.png",
      lightCycle:3,
      emptyCycle:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var orderId = options.orderId;
      var lootUserId = options.lootUserId;
      this.setData({orderId:orderId,
        lootUserId: lootUserId
      });
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
  getInnput:function(options){
    console.log(options.detail.value);
    this.setData({ content: options.detail.value})
  },
  star:function(options){
      var that = this;
      var star =options.target.dataset.star;
      var stars = star.split("-");
      star = stars[1];
      var light;
      if(stars[0]=="light"){
        light = parseInt(star) + 1;
      }else{
        light = parseInt(star) + 1 + that.data.lightCycle;
      }
      var empty = 5 - light;
      this.setData({
        lightCycle: light,
        emptyCycle: empty
      });
  },
  send:function(){
    var star = this.data.lightCycle;
    var orderId = this.data.orderId;
    var lootUserId = this.data.lootUserId;
    var content = this.data.content;
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/evaluate-save',
      data: {
        "order.id": orderId,
        "user.id": lootUserId,
        "evaluate.content":content,
        "evaluate.stars":star
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if(res.data=="success"){
          wx.showToast({
            title: "评价成功",
            success: function () {

              setTimeout(function () {
                wx.hideToast();
                wx.redirectTo({
                  url: '/pages/orderManager/orderManager',
                })
              }, 2000)
            }
          })
        }
      }
    });
  }
})