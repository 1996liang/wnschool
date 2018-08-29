// pages/primaryOrder/primaryOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "buttonViewHide": false,
    "inputViewHide": true,
    userInfo:null,
    "animationData":[],
    "hiddent":true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var userInfo = wx.getStorageSync("userInfo");
    console.log(id);
    this.setData({
      "userInfo": userInfo
    })
    this.getMsg(id);
    this.getTalk(id);
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
  getInput:function(options){
    console.log(options.detail.value)
    this.setData({ inputValue:options.detail.value})
  },
  send:function(){
    var inputValue = this.data.inputValue;
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/order-sendOrderTalk',
      data: {
        "orderTalk.lootId": that.data.userInfo.id,
        "orderTalk.content":inputValue,
        "orderTalk.orderId": that.data.data.orderPrivate.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if(res.data=="success"){
          var wo = {
            lootId: that.data.userInfo.id,
            content: inputValue
          }
          var msg = that.data.msg
          msg.unshift(wo);
          that.setData({ msg: msg, inputValue: "" })
          that.question();
        }
      }
    });
  },
  question: function () {
    console.log(123)
    var that = this;
    var animation = wx.createAnimation({
      duration: 700,
      timingFunction: 'ease',
    })
    setTimeout(function () {
      animation.scale(0.3).step();
      that.setData({ animationData: animation.export() });
      that.setData({
        buttonViewHide: !that.data.buttonViewHide,
        inputViewHide: !that.data.inputViewHide
      });

      animation.scale(1).step();
      that.setData({ animationData: animation.export() });
    }, 100)
  },
  getMsg(id){
    var that = this;
    var userInfo = this.data.userInfo;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/order-getOrderPrivateMsg',
      data: {
        "order.id": id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        var time =util.getSuccessTime(res.data.orderPrivate.order.successTime);
        res.data.orderPrivate.order.successTime= time;
        if (res.data.user.gender == 1) {
          res.data.user.gender = "/image/icon/boy.png"
        } else if (res.data.user.gender == 2) {
          res.data.user.gender = "/image/icon/girl.png"
        } else {
          res.data.user.gender = "/image/icon/know.png"
        }
        that.setData({data:res.data})
      }
    });
  },
  getTalk(id){
    var that = this;
    var userInfo = this.data.userInfo;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/order-getUserOrderTalk',
      data: {
        "order.id": id,
        //注意这里要改回来 userInfo.id   漏洞
        "user.id": userInfo.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        // var wo = new Array();
        // var ni = new Array();
        for(var i=0;i<res.data.orderTalk.length;i++){
          var date = util.formatTime(res.data.orderTalk[i].createTime);
          res.data.orderTalk[i].createTime = date;
          //注意这里要改回来 userInfo.id   漏洞
          console.log(res.data.orderTalk[i].hostId + "-------" + userInfo.id);
          // if (res.data.orderTalk[i].lootId == userInfo.id){
          //   wo.push(res.data.orderTalk[i]);
          // }else{
          //   ni.push(res.data.orderTalk[i]);
          // }
        }
        that.setData({ msg: res.data.orderTalk })
        // that.setData({ wo:wo,ni:ni})
      }
    });
  },
  call:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.data.orderPrivate.phoneNumber //仅为示例，并非真实的电话号码
    })
  },
  copy:function(){
    var that = this;
    //动画
    wx.setClipboardData({
      data: that.data.data.orderPrivate.weChatNumber,
      success:function(){

      } 
    })
  },
  yulan:function (){
    var image = this.data.data.orderPrivate.imageUrl;
    wx.previewImage({
      urls: [image]
    })
  },
  return1:function(){
    // wx.redirectTo({
    //   url: '/pages/orderManager/orderManager',
    // })
    wx.navigateBack({
      delta:1
    })
  }
})