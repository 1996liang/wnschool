// pages/orderLootEvaluate/orderLootEvaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starImage: "/image/icon/evaluate-empty.png",
    starLightImage: "/image/icon/evaluate-light.png",
    lightCycle: null,
    emptyCycle: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    var id = options.id;
    var user = JSON.parse(options.user);
    console.log(user)
    this.setData({
      "userInfo": userInfo,
      "user":user,
      id:id
    })
  
    this.getMsg();
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
   getMsg(){
     var that = this;
     var util = require('../../utils/util.js');
     var touxiang = new Array('/image/icon/person0.png', '/image/icon/person1.png', '/image/icon/person2.png', '/image/icon/person3.png', '/image/icon/person4.png');
     wx.request({
       url: 'https://api.wnschool.cn/evaluate-getEvaluates',
       data: {
         "user.id": that.data.id
       },
       header: {
         "Content-Type": "application/x-www-form-urlencoded"
       },
       method: 'POST',
       success: function (res) {
          console.log(res)
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].createTime = util.formatTime(res.data[i].createTime);
              res.data[i].emptyCycle = 5 - res.data[i].stars;
              res.data[i].lightCycle = res.data[i].stars;
              res.data[i].avatarUrl = touxiang[Math.floor(Math.random() * touxiang.length)]
            }
              that.setData({ data:res.data })
          }
       }
     })
   } 
})