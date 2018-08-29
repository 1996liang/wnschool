// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "userInfo": null,
    "buttonViewHide": false,
    "inputViewHide": true,
    "hiddent": true,
    animationData: {},
    animation1: {},
    data: null,
    msg: null,
    'tishi': null,
    replyData: null,
    louid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    var id = options.id;
    this.setData({
      "userInfo": userInfo,
      "orderId":id
    })
    var util = require('../../utils/util.js');
    var that = this;
    //获得订单内容
    wx.request({
      url: 'https://api.wnschool.cn/order-getOrderDetail',
      data: {
        // "code":code,
        "id": id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        var time = util.formatTime(res.data[0].createTime);
        var successTime = util.getSuccessTime(res.data[0].successTime);
        res.data[0].createTime = time;
        res.data[0].successTime = successTime;
        var sex = res.data[0].sex;
        switch (sex) {
          case 0:
            res.data[0].sex = "不限";
            break;
          case 1:
            res.data[0].sex = "男生";
            break;
          case 2:
            res.data[0].sex = "女生";
            break;
        }
        that.setData({ data: res.data })

      }
    });
    //获得订单评论
    wx.request({
      url: 'https://api.wnschool.cn/order-getOrderComments',
      data: {
        // "code":code,
        "id": id,
        pageSize: 5,
        pageNo: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        for (var i = 0; i < res.data.comment.length; i++) {
          var time = util.formatTime(res.data.comment[i][3]);
          res.data.comment[i][3] = time;
          res.data.comment[i][5] = "";
          res.data.comment[i][10] = true;
          for (var j = 0; j < res.data.beReply.length; j++) {
            if (res.data.comment[i][0] == res.data.beReply[j][0]) {
              res.data.comment[i][5] = res.data.beReply[j][2];
              res.data.comment[i][10] = false;
            } else {
              res.data.comment[i][10] = true;
            }
          }
          that.setData({ replyData: res.data })
        }

      }
    })
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
    var o ={
      id:this.data.orderId
    };
    this.onLoad(o);
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
  replyPerson: function (options) {
    var louid = options.currentTarget.dataset.louid
    this.setData({
      holder: "回复 :" + this.data.replyData.comment[louid][6],
      louid: this.data.replyData.comment[louid][1]
    });
  },
  //点击询问按钮
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
  //点击我要接单按钮
  lootOrder: function () {
    this.getValidation();
  },

  //获取输入框的内容
  getmsg: function (options) {
    this.setData({ msg: options.detail.value });
  },
  //查看是否有接单资格
  getValidation: function () {
    var that = this;
    var userInfo = this.data.userInfo;
    if (userInfo.phoneNumber == null) {
      console.log("123")
      wx.showModal({
        title: '提示',
        content: '查看到你需要进行身份信息填写,是否开始身份信息填写？',

        //可能有漏洞，redirect，或者需要native
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/shenfenValidation/shenfenValidation?loot='+that.data.data[0].id,
            })
          }
        }
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/lootValidation-getValidation',
      data: {
        "user.id": that.data.userInfo.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data == -1) {
          wx.showModal({
            title: '提示',
            content: '接单需要进行实名认证，是否开始实名认证',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/validation/validation',
                })
              } else if (res.cancel) {
                that.setData({ 'tishi': "接单失败", msg: null });
                that.tishi();
              }
            }
          })
        } else if(userInfo.id==that.data.data[1].id){
          that.setData({ 'tishi': "不能接自己的单哦", msg: null });
          that.tishi();
        }else{
          // var that = this;
          wx.showModal({
            title: '你确定要承接 ' + that.data.data[1].nickName + " 的订单吗?",
            content: '',
            success:function(res){
              if(res.confirm){
                that.jiedan(userInfo);
              }
            }
          })
        }
      }
    });
  },
  //点击回复按钮
  send: function () {
    var util = require('../../utils/util.js');
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
  
    var result = util.reg("\\n[\s| ]*\\r",this.data.msg);
    if (result==true) {
      this.setData({ 'tishi': "不能为空" });
      this.tishi();
    } else {
      var that = this;
      wx.request({
        url: 'https://api.wnschool.cn/order-saveOrderComment',
        data: {
          //订单的id
          //被回复的人的id
          //评论的人的id
          //内容
          "order.id": that.data.data[0].id,
          "orderComment.beReplyId": that.data.louid,
          "orderComment.commentId": that.data.userInfo.id,
          "orderComment.content": that.data.msg
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          if (res.data == "success") {
            that.setData({ 'tishi': "回复成功", msg: null });
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
  //接单
  jiedan: function (userInfo) {
   var that = this;
    wx.request({
      url: 'https://api.wnschool.cn/order-updateOrderStatus',
      data: {
        // "code":code,
        "order.id": that.data.data[0].id,
        "order.status": 2,
        "user.id": userInfo.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data == "lootSuccess") {
          wx.showToast({
            title: '接单成功',
            success: function () {
              setTimeout(function () {
                wx.showLoading({
                  title: '正在前往发单者的隐私订单信息.....',
                  success: function () {
                    setTimeout(function () {
                      wx.hideLoading();
                      wx.navigateTo({
                        url: "/pages/privateOrder/privateOrder?id=" + that.data.data[0].id,
                      })
                    }, 1000)
                  }
                })
              }, 1000);
            }
          })
        } else if (res.data == "ordered loot"){
          that.setData({ 'tishi': "订单已被承接" });
          that.tishi();
        } else if (res.data == "not validation"){

          wx.showModal({
            title: '你还没有进行实名认证',
            content: '',
            showCancel:false
          })
        } else if (res.data == "validation Invalid") {

          wx.showModal({
            title: '你的实名认证已超过24小时，已失效',
            content: '',
            showCancel: false
          })
        }
      }
    })
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
      delta: 1
    })
  },
})