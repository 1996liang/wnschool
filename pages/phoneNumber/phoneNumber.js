// pages/phoneNumber/phoneNumber.js
Page({

  data: {
    'phoneNumber': null,
    randomNumber: null,
    "animationData": [],
    "hiddent": true,
    timeStamp: null,
    'tishi': null,
    disabled:false,
    daojishi:"获取验证码"
  },
  onLoad: function (options) {
    console.log(options)
    var name = options.name;
    var weChat = options.weChat;
    // var loot = options.loot;
    // console.log(loot)
    this.setData({name:name,weChat:weChat})
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getInput: function (options) {
    var phoneNumber = options.detail.value;
    this.setData({ 'phoneNumber': phoneNumber });
  },
  getRandom: function (options) {
    var randomInput = options.detail.value;
    this.setData({ 'randomInput': randomInput });
  },
  getWeChat:function(options){
    var weChatInput = options.detail.value;
    this.setData({ 'weChatInput': weChatInput });
  },
  idCode: function () {
    if (this.data.phoneNumber == null || this.data.phoneNumber == "") {
      this.setData({ 'tishi': "请输入手机号码" });
      this.tishi();
      return;
    } else {
      this.randomNumber();
      var randomNumber = this.data.randomNumber;
      var timeStamp = Date.parse(new Date());
      var phoneNumber = this.data.phoneNumber;
      this.setData({ timeStamp: timeStamp });
      console.log(randomNumber);
      this.daojishi();
    }
  },
  daojishi:function(){
    var s = 5;
    var that = this;
    that.setData({ disabled: true, daojishi: s + "秒后重新发送"})
    var i = setInterval(function(){
      if (s == 0) {
        clearInterval(i);
        that.setData({ daojishi: "获取验证码", disabled: false })
        return;
      }
      s = s-1;
      that.setData({daojishi:s+"秒后重新发送"})
    },1000);


  },
  randomNumber: function () {
    var randomNumber = (Math.random() * 1000000).toFixed();
    while (randomNumber.length != 6) {
      randomNumber = (Math.random() * 1000000).toFixed();
    }
    this.setData({ 'randomNumber': randomNumber });
  },
  
  confirm: function () {
    var that = this;
    if (this.data.timeStamp == null || this.data.randomNumber == null || this.data.phoneNumber == null || this.data.phoneNumber == "") {
      this.setData({ 'tishi': "请认真输入信息" });
      this.tishi();
      return;
    }
    if (this.data.randomInput == null || this.data.randomInput == "") {
      this.setData({ 'tishi': "请输入验证码" });
      this.tishi();
      return;
    }
    if (this.data.randomInput == this.data.randomNumber) {
      var userInfo = wx.getStorageSync("userInfo");
      wx.request({
        url: 'https://api.wnschool.cn/user-phoneNumberSave',
        data: {
          "user.id":userInfo.id,
          "user.phoneNumber":that.data.phoneNumber,
          "user.weChatNumber": that.data.weChat,
          "user.contactName":that.data.name
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          if(res.data=="success"){
            userInfo.phoneNumber = that.data.phoneNumber,
            userInfo.weChatNumber = that.data.weChat,
            userInfo.contactName = that.data.name;
            wx.setStorageSync("userInfo", userInfo);
            wx.showToast({
              title: '验证成功',
              success:function(){
                var id = that.data.loot;
                console.log(id);
                setTimeout(function(){
                  wx.hideToast();
                  wx.navigateBack({
                    delta: 1
                  })
                },2000)
              }
            })
          }
        }
      })
    } else {
      this.setData({ 'tishi': "验证码错误" });
      this.tishi();
      return;
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
  }
})