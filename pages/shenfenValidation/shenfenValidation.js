// pages/shenfenValidation/shenfenValidation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "animationData": [],
    "hiddent": true,
    'tishi': null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var loot = options.loot;
    // console.log(loot)
    // if(loot!=null){
    //   this.setData({loot,loot})
    // }
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
  getInput:function(options){
    var name = options.detail.value;
    this.setData({name:name});
  },
  getWeChat:function(options){
    var weChat = options.detail.value;
    this.setData({ weChat: weChat });
  },

  confirm: function () {
    var that = this;
    var name = this.data.name ;
    var weChat = this.data.weChat;
    var loot = this.data.loot;
    if (name== null ||weChat == null ||name=="" ||weChat=="" ) {
      this.setData({ 'tishi': "请认真输入信息" });
      this.tishi();
      return;
    }else{
      // var s = '/pages/phoneNumber/phoneNumber?name='+name+"&weChat="+weChat
      // if(loot==null){
      //   +"&loot=" + loot
      // }
      wx.redirectTo({
        url: '/pages/phoneNumber/phoneNumber?name='+name+"&weChat="+weChat,
      })
    }
  },
  tishi: function () {
    var that = this;
    //动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    });
    //显示
    that.setData({ "hiddent": false })
    //开始动画，导入动画
    animation.translateY(-60).step();
    that.setData({ "animationData": animation.export() })
    setTimeout(function () {
      that.setData({ "hiddent": true })
    }, 1500)
  },

})