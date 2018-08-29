// pages/submitSchoolCircle/submitSchoolCircle.js
Page({
  data: {
    imageLeng: 1,
    imageHidden: true,
    images: [],
    animation1: {},
    "hiddent": true,
    finish: false,
    tishi: null,
    imagesUrl: []
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo });
    const ctx = wx.createCanvasContext("addCanvas");
    ctx.beginPath();
    ctx.setStrokeStyle("#C9C9C9");
    ctx.setLineWidth(2);
    ctx.moveTo(10, 30);
    ctx.lineTo(50, 30);
    ctx.moveTo(30, 10);
    ctx.lineTo(30, 50);
    ctx.stroke();
    ctx.draw();
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
  cancel: function () {
    wx.switchTab({
      "url": "/pages/schoolcircle/schoolcircle"
    })
  },
  send: function () {
    var that = this;
    console.log(this.data.content)
    if (that.data.content == null) {
      that.setData({ 'tishi': "不能为空" });
      that.tishi();
    } else {
      if (that.data.images[0] != null) {
        that.uploadImage(0);
        console.log(1111111111);
        return;
      }
      that.submitSchool();
      console.log(that.data.imagesUrl.toString())
    }
  },
  uploadImage: function (i) {
    var that = this;
    // console.log(that.data.images[i]);
    wx.uploadFile({
      url: 'https://api.wnschool.cn/school-upload',
      filePath: that.data.images[i],
      name: 'file',
      success: function (options) {
        var images = that.data.imagesUrl;
        var o = JSON.parse(options.data).imageUrl;
        images.push(o);
        that.setData({ imagesUrl: images });
        // console.log(o);
      },
      fail: function (options) {
        console.log(options)
      },
      complete: function (options) {
        ++i;
        if (i == that.data.images.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          that.submitSchool();
        } else {//若图片还没有传完，则继续调用函数
          that.uploadImage(i);
        }
      }
    })
  },
  submitSchool: function () {
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/schoolCircle-save',
      data: {
        "user.id": that.data.userInfo.id,
        "tiezi.content": that.data.content,
        "tiezi.images": that.data.imagesUrl.toString()
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data == "success") {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  "url": "/pages/schoolcircle/schoolcircle"
                })
              }, 2000)
            }
          })
        }
      }
    })
    console.log(that.data.imagesUrl.toString())
  },
  addImage: function () {
    var that = this;
    var images = that.data.images;
    wx.chooseImage({
      count: 9,
      success: function (res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          images.push(res.tempFilePaths[i]);
        }
        if (images.length == 9) {
          that.setData({ finish: true });
        }
        that.setData({ images: images, "imageHidden": false });
        console.log(res)
      },
    })
  },
  getMsg: function (options) {
    this.setData({ content: options.detail.value });
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