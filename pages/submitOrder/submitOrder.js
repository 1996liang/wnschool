// pages/submitOrder/submitOrder.js
var date = new Date();
var months = [];
var days = [];
var hours = [];
var minutes = [];
for (let i = date.getMonth() + 1; i <= 12; i++) {
  months.push(i);
}
for (let i = date.getDate(); i <= 31; i++) {
  days.push(i);
}
for (let i = date.getHours(); i < 24; i++) {
  hours.push(i);
}
for (let i = date.getMinutes(); i < 60; i++) {
  minutes.push(i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'kuaidi', value: '代拿快递' },
      { name: 'buy', value: '买(带)东西' },
      { name: 'hello', value: '叫早/道晚安' },
      { name: 'send', value: '寄快递' },
      { name: 'dayin', value: '打印资料' },
      { name: 'carry', value: '搬运物质/行李' },
      { name: 'jiaofei', value: '缴费' },
      { name: 'other', value: '其他' },
    ],
    hidden: true,
    typeValue: null,
    "icon": "/image/icon/select.png",
    timeViewIcon: "/image/icon/select.png",
    image: "",
    "imageHidden": true,
    "timeHidden": true,
    imagesUrl:[],
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    value: [],
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo:userInfo});
    if (userInfo.phoneNumber == null ||userInfo.contactName == null || userInfo.weChatNumber ==null) {
      wx.showModal({
        title: '提示',
        content: '发布订单前需要进行身份信息填写,是否开始？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/shenfenValidation/shenfenValidation',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/run/run',
            })
          }
        }
      })
    }else{
      var contactName = userInfo.contactName;
     var weChatNumber =  userInfo.weChatNumber;
     var phoneNumber =  userInfo.phoneNumber;
     this.setData({ contactName: contactName, weChatNumber: weChatNumber, phoneNumber: phoneNumber});
    }
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
    this.onLoad();
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

  clickType: function () {
    this.setData({ hidden: !this.data.hidden, timeHidden: true, "timeViewIcon": "/image/icon/select.png" });
    if (this.data.hidden == false) {
      this.setData({ "icon": "/image/icon/selected.png" })
    } else {
      this.setData({ "icon": "/image/icon/select.png" })
    }
  },
  getRadio: function (options) {
    var items = this.data.items;
    var value = "";
    for (var i = 0; i < items.length; i++) {
      var name = items[i].name.toString();
      if (name.indexOf(options.detail.value) != -1) {
        value = items[i].value;
      }
    }
    this.setData({ typeValue: value });
  },
  clickPage: function () {
    this.setData({ timeHidden: true, hidden: true, "icon": "/image/icon/select.png", "timeViewIcon": "/image/icon/select.png" });
  },
  upload: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({ image: res.tempFilePaths[0], "imageHidden": false });

      },
    })
  },
  yulan: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.image],
    })
  },
  getValue: function (options) {
    var val = options.detail.value;
    var month = val[0];
    var day = val[1];
    var hour = val[2];
    var minute = val[3];
    var data = this.data;
    this.setData({ inputValue: data.months[month] + "-" + data.days[day] + " " + data.hours[hour] + ":" + data.minutes[minute] });
    this.setData({ value: [month, day, hour, minute] });
  },
  clickTime: function () {
    this.setData({ timeHidden: !this.data.timeHidden, hidden: true, "icon": "/image/icon/select.png" });
    if (this.data.timeHidden == false) {
      this.setData({ "timeViewIcon": "/image/icon/selected.png" })
    } else {
      this.setData({ "timeViewIcon": "/image/icon/select.png" })
    }
  },
  send: function (options) {
    console.log(options.detail.value)
    switch(options.detail.value.sex){
      case "notkonwn":
        options.detail.value.sex=0;
        break;
      case "boy":
        options.detail.value.sex = 1;
        break;
      case "girl":
        options.detail.value.sex = 2;
        break;
    }
    var successTime = new Date().getFullYear() + "-" + options.detail.value.successTime;
    var userInfo = this.data.userInfo;
    this.check(options, userInfo, successTime);
  
  },
  //向服务器发出微信支付的请求
  wxPayServer:function(options){
    var that = this;
    var total_fee = parseFloat(options.detail.value.money);
    total_fee = total_fee.toFixed(2)*100;
   
    wx.request({
      // url: 'http://localhost:8080/wnschool/weChatPay',
      url:'https://api.wnschool.cn/weChatPay',
      data: {
        openid:that.data.userInfo.openid,
        // openid:"oxw0a0XKJSIeBG1juJupmHn-ESpI",
        total_fee: total_fee
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.parserXML(res.data);
        if (that.data.return_code == "SUCCESS" && that.data.return_msg=="OK"){
          that.wePay(options);
        }
      }
    });
  },
  parserXML: function (xmlmsg){
    var parser = require('../../lib/xmldom/dom-parser');
    var xml = xmlmsg;
    var XMLParser = new parser.DOMParser();
    var doc = XMLParser.parseFromString(xml);
    var return_code = doc.getElementsByTagName('return_code')[0];
    var return_msg = doc.getElementsByTagName('return_msg')[0];
    var appid = doc.getElementsByTagName('appid')[0];
    var prepay_id = doc.getElementsByTagName('prepay_id')[0];
    var out_trade_no = doc.getElementsByTagName('out_trade_no')[0]
    // var NOTENOUGH = 
    console.log(return_code.firstChild.data)
    console.log(return_msg.firstChild.data)
    console.log(appid.firstChild.data)
    console.log(prepay_id.firstChild.data)
    this.setData({ 
      return_code: return_code.firstChild.data,
      return_msg: return_msg.firstChild.data,
      appid: appid.firstChild.data,
      prepay_id: prepay_id.firstChild.data,
      out_trade_no: out_trade_no.firstChild.data
    })
  },
    //微信支付，获取签名
  getSign: function (appid,package1) {
    var util = require("../../utils/md5.js");

    var appid = appid;
    var timeStamp = (new Date().getTime()).toString();
    var nonceStr = ((Math.random() * 1000000000000).toFixed(0)).toString();
    // var package1 = "prepay_id=wx2017042422425202b302913d0549410077";
    var signType = "MD5";
    var key = "guangzhouneitekejiyouxiangongsi0";
    var s = "";
    s = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + package1 + "&signType=" + signType + "&timeStamp=" + timeStamp + "&key=" + key;
    var paySign = util.hexMD5(s);
    paySign = paySign.toUpperCase();
    this.setData({
      param: {
        "appid": appid,
        "timeStamp": timeStamp,
        "nonceStr": nonceStr,
        "signType": signType,
        "paySign": paySign,
        "package1": package1
      }
    })
  },
  //微信支付
  wePay(options) {
    var that = this;
    // var util = require("../../utils/md5.js");

    // var appid = "wx6fdb9f9ff39deff1";
    // var timeStamp = (new Date().getTime()).toString();
    // var nonceStr = ((Math.random()*1000000000000).toFixed(0)).toString();
    var package1 = "prepay_id=" + that.data.prepay_id;
    var appid = that.data.appid;
    // var signType="MD5";
    // var key="guangzhouneitekejiyouxiangongsi0";
    // var s = "";
    // s="appId="+appid+"&nonceStr="+nonceStr+"&package="+package1+"&signType="+signType+"&timeStamp="+timeStamp+"&key="+key;
    // var paySign = util.hexMD5(s);
    // paySign = paySign.toUpperCase();
    this.getSign(appid,package1);
    wx.requestPayment({
      timeStamp: that.data.param.timeStamp,
      nonceStr: that.data.param.nonceStr,
      package: that.data.param.package1,
      signType: that.data.param.signType,
      paySign: that.data.param.paySign,
      success: function (res) {
        console.log(res);
        var successTime = new Date().getFullYear() + "-" + options.detail.value.successTime;
        var userInfo = that.data.userInfo;
        if (that.data.image != null && that.data.image != "") {
          that.uploadImage(options, userInfo, successTime);
          return;
        }
        that.submit(options, userInfo, successTime);
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },
  uploadImage:function(options,userInfo,successTime){
    var that = this;
    wx.uploadFile({
      url: 'https://api.wnschool.cn/order-upload',
      filePath: that.data.image,
      name: 'file',
      success: function (options1) {
        console.log(options1)
        var images = that.data.imagesUrl;
        var o = JSON.parse(options1.data).imageUrl;
        images.push(o);
        that.setData({ imagesUrl: images });
        that.submit(options, userInfo, successTime)
      },
      fail: function (options) {
        console.log(options)
      }
    })
  },
  check:function(options,userInfo,successTime){
    var util = require('../../utils/util.js');
    var that = this;
    var phoneNumber = util.reg("\\n[\s| ]*\\r", options.detail.value.phoneNumber);
    var contactName = util.reg("\\n[\s| ]*\\r", options.detail.value.contactName);
    var weChatNumber = util.reg("\\n[\s| ]*\\r", options.detail.value.weChatNumber);
    var privateTalk = util.reg("\\n[\s| ]*\\r", options.detail.value.privateTalk);
    var hostId = util.reg("\\n[\s| ]*\\r", userInfo.id);
    var content = util.reg("\\n[\s| ]*\\r", options.detail.value.money);
    var money = util.reg("\\n[\s| ]*\\r", options.detail.value.money);
    var orderType = util.reg("\\n[\s| ]*\\r", options.detail.value.orderType); 
    var sex = util.reg("\\n[\s| ]*\\r", parseInt(options.detail.value.sex));
    var success = util.reg("\\n[\s| ]*\\r",successTime);
    if (phoneNumber == true || contactName == true || weChatNumber == true || success == true || privateTalk == true || hostId == true || content == true || money == true || orderType == true){
      wx.showModal({
        title: '数值不能为空',
        content: '',
        showCancel:false
      })
    }
    else{
      wx.showModal({
        title: '你确定发布订单？',
        content: '',
        success:function(res){
          if (res.confirm){
            that.wxPayServer(options);
          }
        }
      })
    }
  },
submit: function (options, userInfo, successTime) {
    console.log(userInfo)
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/order-orderSave',
      data: {
        "user.id": userInfo.id,
        "orderPrivate.phoneNumber": options.detail.value.phoneNumber,
        "orderPrivate.contactName": options.detail.value.contactName,
        "orderPrivate.weChatNumber": options.detail.value.weChatNumber,
        "orderTalk.content": options.detail.value.privateTalk,
        "orderTalk.hostId": userInfo.id,
        "orderPrivate.imageUrl": that.data.imagesUrl.toString(),
        weChatNo: that.data.out_trade_no,
        content: options.detail.value.content,
        money: options.detail.value.money,
        orderType: options.detail.value.orderType,
        sex: parseInt(options.detail.value.sex),
        successTime: successTime,


      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data == "success") {
          wx.showToast({
            title: '发布成功',
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: "/pages/run/run",
                })
              },1000);
            }
          })
        } else if (res.data =="user not phone validation"){
          wx.showModal({
            title: '用户未身份信息填写',
            content: '',
            showCancel:false
          })
        }
      }
    })
  },
  jujiao:function(){
    this.setData({ timeHidden: true, hidden: true, "icon": "/image/icon/select.png", "timeViewIcon": "/image/icon/select.png"});
  },
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  }
})