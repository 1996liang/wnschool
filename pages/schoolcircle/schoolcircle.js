// pages/schoolcircle/schoolcircle.js
Page({
  data: {
    personal2: true,
    "userInfo": null,
    pageNo:1,
    tishi:true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    console.log(userInfo);
    this.setData({
      "userInfo": userInfo
    })
    this.getSchoolList("暂时没有人发布校圈哦");
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      "title": "加载中",
      "mask": true,
      "success": function () {
        var pageNo = that.data.pageNo + 1
        that.setData({ pageNo: pageNo });
        that.getSchoolList("没有更多了哦");
        setTimeout(function () {
          wx.hideLoading();
          that.setData({ tishi: true });
        }, 1000)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showLoading({
      "title": "加载中",
      "mask": true,
      "success": function () {
        that.setData({ pageNo: 1 });
        that.getSchoolList("暂时没有人发布校圈哦");
        setTimeout(function () {
          wx.stopPullDownRefresh();
          wx.hideLoading();
          that.setData({ tishi: true});
        }, 1000)
      }
    })
  },
  submitSchoolCircle: function () {
    wx.navigateTo({
      "url": "/pages/submitSchoolCircle/submitSchoolCircle"
    })
  },
  personal2: function (options) {
    var user = options.currentTarget.dataset;
    this.setData({
      schoolCircle:user,
      personal2: false
    })
  }, exit: function () {
    this.setData({
      personal2: true
    })
  }
  ,
  preview: function () {
    console.log(1123)
    var avatar = this.data.userInfo.avatarUrl;
    console.log(avatar)
    wx.previewImage({
      urls: [avatar]
    })
  },
  detail: function (options) {
    var item = options.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      "url": "/pages/schoolcircleDetail/schoolcircleDetail?item=" + JSON.stringify(item)
    })
  },
  getSchoolList: function (tishiText){
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/schoolCircle-getSchoolList',
      data: {
        "pageNo": that.data.pageNo,
        "pageSize": 7,
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.length!=0){
          for (var i = 0; i < res.data.length; i++) {
            var time = util.formatTime(res.data[i].schoolCreateTime);
            res.data[i].schoolCreateTime = time; 
            if (res.data[i].schoolImages != null){
              var images = res.data[i].schoolImages;
              images = images.split(",");
              res.data[i].schoolImages = images;
              res.data[i].isOneImages = true;
              res.data[i].isManyImages = true;
              if(images.length==1&&images[0]!=""){
                res.data[i].imagesOne = images;
                res.data[i].isOneImages=false;
              } else if (images.length>1){
                res.data[i].isManyImages = false;
              }
            }
          }
          that.setData({ data: res.data });
        } else {
          that.setData({ tishi: false, tishiText: tishiText});
        }
      }
    });
  }
})