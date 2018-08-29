// pages/validation/validation.js
Page({
  data: {
    animation1: {},
    "hiddent": true,
    "imageHidden":true,
    icon: "/image/icon/xia(2).png",
    shenfenHidden:false,
    xueshengHidden:false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    this.setData({
      "userInfo": userInfo
    })
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
  send: function (options) {
    console.log(options.detail.value)
    this.setData({msg:options.detail.value})
    this.request();
    // wx.showToast({
    //   title: '提交审核成功',
    //   icon: 'success',
    //   duration: 2000,
    //   mask: true,
    //   success: function () {
    //     setTimeout(function () {
    //       wx.switchTab({
    //         "url": "/pages/my/my"
    //       })
    //     }, 2000)
    //   }
    // })
  },
  xueshengImage:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({ xueshengImage: res.tempFilePaths[0], xueshengHidden:true});
      },
    })
  },
  shenfenImage:function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({ shenfenImage: res.tempFilePaths[0], shenfenHidden:true });
      },
    })
  },
  uploadImage: function () {
    if (this.data.xueshengImage != null && this.data.shenfenImage != null) {
      this.upload(this.data.shenfenImage,1);
    }else if (this.data.xueshengImage!=null){
      this.upload(this.data.xueshengImage,0);
    }else if (this.data.shenfenImage != null) {
      this.upload(this.data.shenfenImage,0);
    } else if (this.data.xueshengImage == null && this.data.shenfenImage == null){
        this.setData({tishi:"至少上传一张照片！！"})
        this.tishi();
    }
  },
  upload:function(options,isUploads){
    var that = this;
    wx.uploadFile({
      url: 'https://api.wnschool.cn/validation-upload',
      filePath: options,
      name: 'file',
      success: function (options1) {
        console.log(options1)
        if (options = that.data.shenfenImage){
          var shenfenImage = JSON.parse(options1.data).imageUrl;
          that.setData({ shenfenImageUrl: shenfenImage})
        }
        if (options = that.data.xueshengImage) {
          var xueshengImage = JSON.parse(options1.data).imageUrl;
          that.setData({ xueshengImageUrl: xueshengImage })
        }
      },
      fail: function (options) {
        console.log(options)
      },
      complete: function (options) {
        if(isUploads==1){
           that.upload(that.data.xueshengImage,0);
        }else{
          console.log("执行完毕")
          that.submit();
        }
      }
    })
  },
  request: function () {
    var loot = this.data.msg;
    if (loot.contactName==null||loot.contactName==""){
        this.setData({ tishi: "身份证姓名不能为空" })
        this.tishi();
        return;
    }
    if (loot.idCardNo == null || loot.idCardNo == "") {
      this.setData({ tishi: "身份证号码不能为空" })
      this.tishi();
      return;
    }
    if (loot.zhifubao == null || loot.zhifubao == "") {
      this.setData({ tishi: "支付宝账户不能为空" })
      this.tishi();
      return;
    }
    if (loot.xueyuan == null || loot.xueyuan == "") {
      this.setData({ tishi: "学院不能为空" })
      this.tishi();
      return;
    }
    if (loot.banji == null || loot.banji == "") {
      this.setData({ tishi: "班级不能为空" })
      this.tishi();
      return;
    }
    if (loot.xuehao == null || loot.xuehao == "") {
      this.setData({ tishi: "学号不能为空" })
      this.tishi();
      return;
    }
    this.uploadImage();
   
  },
  submit:function(){
    var that = this;
    var loot = this.data.msg;
    var util = require('../../utils/util.js');
     wx.request({
      url: 'http://localhost:8080/wnschool/lootValidation-saveValidation',
      data: {
          "user.id":that.data.userInfo.id,
          "loot.contactName": loot.contactName,
          "loot.idCardNo": loot.idCardNo,
          "loot.zhifubao": loot.zhifubao,
          "loot.xueyuan": loot.xueyuan,
          "loot.banji": loot.banji,
          "loot.xuehao": loot.xuehao,
          "loot.status": 1,
          "loot.studentIdCardImage":that.data.xueshengImageUrl,
          "loot.idCardImage": that.data.shenfenImageUrl,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        var msg = "";
        if (that.data.xueshengImageUrl==null){
            msg = "student";
        } else if (that.data.shenfenImageUrl==null){
          msg = "idCard";
        }
        wx.redirectTo({
          url: '/pages/validationStatus/validationStatus?msg='+msg,
        })
      }
    });
  },
  xianshi:function(){
    var icon = "";
    if (this.data.icon =="/image/icon/xia(2).png"){
      icon = "/image/icon/shang(1).png"
    }else{
      icon = "/image/icon/xia(2).png"
    }
      this.setData({ imageHidden: !this.data.imageHidden, icon: icon})
  },
  //动画提示
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
    that.setData({ "animation1": animation.export() })
    setTimeout(function () {
      that.setData({ "hiddent": true })
      animation.translateY(0).step();
      that.setData({ "animation1": animation.export() })
    }, 1500)
  },
})