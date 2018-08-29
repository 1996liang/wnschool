// pages/run/run.js
Page({
  data: {
    personal: true,
    "userInfo": null,
    element: [],
    status: true,
    pageNo: 0,
    tishi: true,
    colors: ['#00C0E2', '#E9C24E','#48C9B0'],
  },
  onLoad: function (options) {
    var userInfo;
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        userInfo = res.data;
        wx.hideLoading();
        if (userInfo.school != null) {
          console.log("no")
          that.setData({
            "userInfo": userInfo
          })
          that.getOrderList(1, "贵校暂时没有人发布订单");
        } else {
          console.log("yes")
          wx.redirectTo({
            url: '/pages/selectSchool/selectSchool',
          })
        }
      }
    });
    wx.showLoading();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showLoading({
      "title": "加载中",
      "mask": true,
      "success": function () {
        that.getOrderList(1,"贵校暂时没有人发布订单");
        setTimeout(function () {
          wx.stopPullDownRefresh();
          wx.hideLoading();
          that.setData({ tishi: true});
        }, 1000)
      }
    })

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
        that.getOrderList(pageNo, "没有更多了哦");
        setTimeout(function () {
          wx.hideLoading();
          that.setData({ tishi: true});
        }, 1000)
      }
    })
  },
  // canvas: function (str,money) {
  //   const ctx = wx.createCanvasContext(str);
  //   ctx.moveTo(2, 2);
  //   ctx.lineTo(50, 0);
  //   ctx.lineTo(48, 30);
  //   ctx.lineTo(0,28);
  //   ctx.setFillStyle("#FE0000");
  //   ctx.fill();
  //   ctx.setFillStyle("white");
  //   ctx.setFontSize(15);
  //   ctx.fillText("￥"+money,10,20);
  //   ctx.draw();
  // },
  personal: function (options) {
    console.log(options.currentTarget.dataset.user);
    var user = options.currentTarget.dataset.user;
    this.setData({
      orderUser:user,
      personal: false
    })
  }, 
  exit: function () {
    this.setData({
      personal: true
    })
  },
  //预览头像
  preview: function () {
    var avatar = this.data.userInfo.avatarUrl;
    wx.previewImage({
      urls: [avatar]
    })
  },
  submitOrder: function () {
    wx.navigateTo({
      url: '/pages/submitOrder/submitOrder',
    })
  },
  orderManager: function () {
    wx.navigateTo({
      url: "/pages/orderManager/orderManager",
    })
  },

  getOrderList: function (pageNo,tishiText) {
    var util = require('../../utils/util.js');
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/order-getOrderList',
      data: {
        // "code":code,
        "user.id":that.data.userInfo.id,
        "user.school":that.data.userInfo.school,
        pageSize: 7,
        pageNo: pageNo
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var colors = that.data.colors;
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            var time = util.formatTime(res.data[i][0].createTime);
            var successTime = util.getSuccessTime(res.data[i][0].successTime);
            res.data[i][0].createTime = time;
            res.data[i][0].successTime = successTime;
            var ran = Math.floor((Math.random() * colors.length));
            console.log(ran)
            res.data[i][1].color=colors[ran];
            var status = res.data[i][0].status;
            switch (status) {
              case 0:
                res.data[i][0].status = "/image/icon/cancelOrder.png";
                that.setData({ status: false })
                break;
              case 1:
                that.setData({ status: false })
                res.data[i][0].status = "";
                break;
              case 2:
                res.data[i][0].status = "/image/icon/loot.png";
                that.setData({ status: false })
                break;
              case 3:
                res.data[i][0].status = "/image/icon/success.png";
                that.setData({ status: false })
                break;
              case 4:
                res.data[i][0].status = "/image/icon/end.png";
                that.setData({ status: false })
                break;
            }
            var sex = res.data[i][0].sex;
            switch (sex) {
              case 1:
                res.data[i][0].sex = "男";
                break;
              case 2:
                res.data[i][0].sex = "女";
                break;
              case 0:
                res.data[i][0].sex = "不限";
                break;
            }

            // that.canvas("money" + i, 100);
          }
          that.setData({ element: res.data });
        } else {
          that.setData({ tishi: false, tishiText: tishiText});
        }
      }
    })
  },
  detail: function (options) {
    var id = options.currentTarget.dataset.id;
    var that = this;
    wx.navigateTo({
      url: "/pages/orderDetail/orderDetail?id="+id,
    })
  },


  getValue: function (options) {
    var data = this.data.schoolData;
    var index = options.currentTarget.dataset.index;
    this.setData({ value: data[index], schoolData: [], selectSchoolHidden: true });
    console.log(this.data.value)
  },
  getMsg: function (options) {
    var value = options.detail.value;
    var util = require('../../utils/chinaUniversityList.js');
    var schoolList = util.getSchoolList();
    var data = new Array();
    for (var i = 0; i < schoolList.length; i++) {
      for (var j = 0; j < schoolList[i].school.length; j++) {
        var name = schoolList[i].school[j].name;
        if (name.indexOf(value) >= 0) {
          // console.log(name)
          data.push(name);
        }
      }
    }
    this.setData({ schoolData: data, selectSchoolHidden: false });
  }
})