// pages/schoolcircleDetail/schoolcircleDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "userInfo": null,
    "buttonViewHide": false,
    "inputViewHide": true,
    animationData: {},
    pageNo: 1,
    tishi: true,
    hiddent:true,
    input: null,
    louid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      "userInfo": userInfo
    })
    if (options.id != null) {
      console.log("获取校圈")
      this.getSchool(options.id);
    } else if (JSON.parse(options.item)!=null){
      var item = JSON.parse(options.item);
      this.loadImage(item);
      this.getOrderComments();
    }
    else{
      wx.showModal({
        title: '程序出错，请稍后重试',
        content: '',
        showCancel:false
      })
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
  loadImage: function (item) {
      console.log(item)
      if (item.schoolImages != null) {
        var images = item.schoolImages;
        item.isOneImages = true;
        item.isManyImages = true;
        if (images.length == 1 && images[0] != "") {
          item.imagesOne = images;
          item.isOneImages = false;
        } else if (images.length > 1) {
          item.isManyImages = false;
        }
        this.setData({ item: item });
    }
  },
  yulan: function (options) {
    console.log(options)
    console.log(options.currentTarget.dataset.url)
    var that = this;
    wx.previewImage({
      current: options.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: that.data.images // 需要预览的图片http链接列表
    })
  },
  question: function () {
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
        inputViewHide: !that.data.inputViewHide,
        holder: ""
      });

      animation.scale(1).step();
      that.setData({ animationData: animation.export() });
    }, 100)
  },
  getOrderComments: function () {
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/schoolCircle-getOrderComments',
      data: {
        "pageNo": that.data.pageNo,
        "pageSize": 7,
        "tiezi.id": that.data.item.schoolId
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.comment.length; i++) {
          var time = util.formatTime(res.data.comment[i][3]);
          res.data.comment[i][3] = time;
          res.data.comment[i][5] = "";
          res.data.comment[i][10] = true;
          for (var j = 0; j < res.data.beReply.length; j++) {
            if (res.data.comment[i][0] == res.data.beReply[j][0]) {
              res.data.comment[i][5] = res.data.beReply[j][2];
              res.data.comment[i][10] = false;
            }else{
              res.data.comment[i][10] = true;
            }

          }
        }
        that.setData({ replyData: res.data })
      }
    });
  },
  getInput: function (options) {
    this.setData({ input: options.detail.value });
  },
  send: function () {
    var value = this.data.input
    var that = this;
    if (value == "" || value == null) {
      this.setData({ tishi: "不能为空" });
      this.tishi();
    } else {
      wx.request({
        url: 'https://api.wnschool.cn/schoolCircle-saveSchoolComment',
        data: {
          "school.id": that.data.item.schoolId,
          "comment.beReplyId": that.data.louid,
          "comment.commentId": that.data.userInfo.id,
          "comment.content": that.data.input
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          if (res.data == "success") {
            that.setData({ 'tishi': "回复成功", msg: null,input:""});
            that.tishi();
            that.question();
          } else {
            that.setData({ 'tishi': "回复失败" });
            that.tishi();
          }
        }
      });
    }
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
  return1: function () {
    wx.navigateBack({
      delta:1
    })
  },
  replyPerson: function (options) {
    var louid = options.currentTarget.dataset.louid
    this.setData({
      holder: "回复 :" + this.data.replyData.comment[louid][6],
      louid: this.data.replyData.comment[louid][1]
    });
  },
  getSchool:function(id){
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/schoolCircle-getSchoolCircle',
      data: {
        "comment.id": id
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.schoolId!=null){
          res.data.schoolCreateTime = util.formatTime(res.data.schoolCreateTime);
          res.data.schoolImages = res.data.schoolImages.split(",");
          that.loadImage(res.data);
          that.getOrderComments();
        } else {
          wx.showModal({
            title: '程序出错，请稍后重试',
            content: '',
            showCancel: false
          })
        }
      } 
    });
  }
})