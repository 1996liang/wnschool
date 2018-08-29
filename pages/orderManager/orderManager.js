// pages/orderManager/orderManager.js
Page({


  //false显示
  //true隐藏
  /**
   * 页面的初始数据
   */
  data: {
    personal: true,
    "userInfo": null,
    quanbu: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    this.setData({
      "userInfo": userInfo
    })
    this.getMsg('getUserOrderList', 0);

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
  // canvas: function (str, money) {
  //   console.log(str)
  //   const ctx = wx.createCanvasContext(str);
  //   ctx.moveTo(2, 2);
  //   ctx.lineTo(50, 0);
  //   ctx.lineTo(48, 30);
  //   ctx.lineTo(0, 28);
  //   ctx.setFillStyle("#FE0000");
  //   ctx.fill();
  //   ctx.setFillStyle("white");
  //   ctx.setFontSize(15);
  //   ctx.fillText("￥ " + money, 10, 20);
  //   ctx.draw();
  // },
  personal: function () {
    this.setData({
      personal: false
    })
  }, exit: function () {
    this.setData({
      personal: true
    })
  },
  preview: function () {
    console.log(1123)
    var avatar = this.data.userInfo.avatarUrl;
    console.log(avatar)
    wx.previewImage({
      urls: [avatar]
    })
  },
  item: function (options) {
    this.setData({ daipingjia: "", quanbu: "", send: "", end: "", daiban: "", daiwancheng: "" });
    var item = options.currentTarget.dataset.item;
    console.log(item)
    switch (item) {
      case "quanbu":
        this.setData({ quanbu: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold" });
        this.getMsg('getUserOrderList', 0);
        break;
      case "send":
        this.setData({ send: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold" });
        this.getMsg('getUserSendOrderList',  0);
        break;
      case "end":
        this.setData({ end: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold" });
        this.getMsg('getUserLootOrderList',  0);
        break;
      case "daiban":
        this.setData({ daiban: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold" });
        this.getMsg('getStatusOrderList',  2);
        break;
      //有漏洞
      case "daiwancheng":
        this.setData({ daiwancheng: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold" });
        this.getMsg('getStatusOrderList',  3);
        break;
      case "daipingjia":
        this.setData({ daipingjia: "border-bottom: 3px solid #62a5f7;color:#62a5f7;font-weight:bold" });
        this.getMsg('getUserOrderNotEvaluate',  4);
        break;
    }
  },
  getMsg(xuanxiang, status) {
    console.log(xuanxiang + " --   -- " + status)
    var that = this;
    var userInfo = this.data.userInfo;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/order-' + xuanxiang,
      data: {
        "user.id": userInfo.id,
        "order.status": status,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            var fadan = {
              hidden: true,
              zhuyao: "zhuyao"
            }
            var jiedan = {
              hidden: true,
              zhuyao: "zhuyao"
            }
            var complete = {
              hidden: true,
              zhuyao: "zhuyao"
            }
            var evaluate = {
              hidden: true,
              zhuyao: "zhuyao"
            }
            var o = {
              fadan: fadan,
              jiedan: jiedan,
              complete: complete,
              evaluate: evaluate,
            }
            res.data[i].push(o)
           
            var time = util.formatTime(res.data[i][0].finishTime);
            res.data[i][0].finishTime = time;
            var status = res.data[i][0].status;
            var orderHost = res.data[i][0].orderHost;
            var lootPerson = res.data[i][0].lootPerson;
            var shenfen = "";
            if (orderHost == userInfo.id) {
              shenfen = "发单";
            } else {
              shenfen = "接单";
            }
            res.data[i][2].shenfen = shenfen;
            //隐藏取消按钮
            res.data[i][2].cancel = "true"
            if (res.data[i][0].isEvaluate != null) {
              evaluate.hidden = false;
            } else {
              evaluate.hidden = true;
            }
            res.data[i][2].evaluate = evaluate;
            switch (status) {
              case 0:
                res.data[i][0].status = "订单已取消";
                break;
              case 1:
                res.data[i][0].status = "订单新发布";
                //显示取消按钮
                res.data[i][2].cancel = "";
                break;
              case 2:
                res.data[i][0].status = "订单已承接";
                if (res.data[i][2].shenfen == "发单") {
                  jiedan.hidden = false;
                  res.data[i][2].jiedan = jiedan;
                  console.log("发单")
                } else {
                  fadan.hidden = false;
                  res.data[i][2].fadan = fadan;
                  console.log("接单")
                  complete.hidden = false;
                  complete.zhuyao = "";
                  res.data[i][2].complete = complete;
                }
                res.data[i][2].cancel = "";
                break;
              case 3:
                res.data[i][0].status = "订单已完成";
                if (res.data[i][2].shenfen == "发单") {
                  jiedan.hidden = false;
                  res.data[i][2].jiedan = jiedan;
                  console.log("发单")
                  complete.hidden = false;
                  res.data[i][2].complete = complete;
                } else {
                  fadan.hidden = false;
                  res.data[i][2].fadan = fadan;
                  console.log("接单")
                }
                break;
              case 4:
                res.data[i][0].status = "订单已结单";
                if (res.data[i][0].orderHost == that.data.userInfo.id) {
                  evaluate.hidden = false;
                  res.data[i][2].evaluate = evaluate;
                }
                if (res.data[i][0].isEvaluate != null) {
                  evaluate.hidden = true;
                  res.data[i][2].evaluate = evaluate;
                }
                break;
            }
          }
        } else {
          that.setData({ tishi: false });
        }

        that.setData({ data: res.data });
        console.log(that.data.data)
      }
    })
  },
  evaluate: function (options) {
    console.log(options.currentTarget.dataset.orderid);
    var orderId = options.currentTarget.dataset.orderid;
    var lootUserId = options.currentTarget.dataset.lootuserid;
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderId=' + orderId + "&lootUserId=" + lootUserId,
    })
  },
  jiedan: function (options) {
    console.log(options);
    var id = options.currentTarget.dataset.id;
    var orderid = options.currentTarget.dataset.orderid;
    console.log(orderid)
    wx.navigateTo({
      url: '/pages/orderLootPrivate/orderLootPrivate?id=' + id + "&orderid=" + orderid,
    })
  },
  fadan: function (options) {
    console.log(options.currentTarget.dataset.id);
    var id = options.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/privateOrder/privateOrder?id=' + id,
    })
  },
  complete: function (options) {
    console.log(options.currentTarget.dataset.index);
    var that = this;
    var index = options.currentTarget.dataset.index;
    var data = this.data.data[index][0];
    var s = '你确定完成订单了吗？ 订单金额只有在双方都确认，点击"完成订单"才会到达接单的同学的账户。'
    if (data.orderHost == that.data.userInfo.id) {
      s = "你确定接单的同学已经完成了吗？"
    }
    wx.showModal({
      title: '提示',
      content: s,
      success: function (res) {
        if (res.confirm) {
          that.completeOrder(index)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  detail: function (options) {
    console.log(options.currentTarget.dataset.id);
    var id = options.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + id,
    })
  },
  completeOrder: function (index) {
    var data = this.data.data[index][0];
    var orderId = data.id;
    var status;
    if (data.status == "订单已承接") {
      status = 2
    } else if (data.status == "订单已完成") {
      status = 3;
    }
    var userInfo = this.data.userInfo;
    var s = "完成订单申请成功,请等待发布订单的同学点击完成订单！！"
    if (data.orderHost == userInfo.id) {
      s = "订单已结束,订单金额将到达接单人的账户，感谢您的使用！！";
    }
    wx.request({
      url: 'https://api.wnschool.cn/order-updateOrderStatus',
      data: {
        // "code":code,
        "order.id": orderId,
        "order.status": status + 1,
        "user.id": userInfo.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data == "lootSuccess") {
          wx.showModal({
            title: '提示',
            content: s,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          // wx.showToast({
          //   title: s,
          //   success: function () {

          //     setTimeout(function () {
          //       wx.hideToast();
          //     }, 2000)
          //   }
          // })
        } else{
          wx.showModal({
            title: '提示',
            content: '订单发生错误',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  },
  cancel:function(options){
    var index = options.currentTarget.dataset.index;
        var item = this.data.data[index];
        if (item[0].status == "订单新发布" && item[2].shenfen=="发单"){
          wx.showModal({
            title: '你确定要取消订单？',
            content: '确定取消订单后，将会退还您的订单金额。',
            success:function(){
              
            }
          })
          //订单主人在状态1时发出取消信号
        } else if (item[0].status == "订单已承接" && item[2].shenfen == "发单"){
          //订单主人在状态2时发出取消信号
          wx.showModal({
            title: '你的订单已被承接，你无法取消订单，请联系承接订单的童鞋取消订单吧.',
            content: '',
            showCancel: false
          })
        } else if(item[0].status == "订单已承接" && item[2].shenfen == "接单"){
          //接单人在状态2时发出取消信号
          wx.showModal({
            title: '你确定要取消订单？',
            content: '确定取消订单后，订单金额将退还到达发布订单的童鞋。'
          })
        }
  }
})