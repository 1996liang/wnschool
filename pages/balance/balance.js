// pages/balance/balance.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    console.log(userInfo);
    this.setData({
      "userInfo": userInfo
    })
    if(userInfo!=null){
      this.getMoney();
    }else{
      wx.showModal({
        title: '用户未登录，请重新登录',
        content: '',
        showCancel:false
      })
    }
  }, 
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  returnMy:function(){
    wx.switchTab({
      "url":"/pages/my/my"
    })
  },
  withdraw:function(){
    console.log(123)
    var that = this;
    wx.navigateTo({
      url:"/pages/balance/tixian/tixian?balance="+that.data.balance
    })
    // wx.showModal({
    //   "title": '提现',
    //   "content": '你确定要提现50元吗',
    //   "showCancel":true,
    //   success: function (res) {
    //     if (res.confirm) {
    //       wx.showToast({
    //         title: '提现成功',
    //         icon: 'success',
    //         duration: 2000,
    //         mask:true
    //       })
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  getMoney(){
    var that = this;
    var util = require('../../utils/util.js');
    wx.request({
      url: 'https://api.wnschool.cn/user-getUserCashFlow',
      data: {
       "user.id":that.data.userInfo.id
        // "tiezi.images":that.data.imagesPath
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // getUserCashFlow
        console.log(res);
        that.setData({balance:res.data.balance});
        if (res.data.userCashFlow.length != 0) {
          console.log(res.data.userCashFlow.length)
          for (var i = 0; i < res.data.userCashFlow.length; i++) {
            var time = that.DateUtil(res.data.userCashFlow[i].createTime);
            var times = time.split("/");
            res.data.userCashFlow[i].createTime= times;
            if (res.data.userCashFlow[i].sendUserId==0){
              res.data.userCashFlow[i].avatarUrl="/image/icon/wannengxiaoyuan.jpg";
              res.data.userCashFlow[i].cashFlow = "-" + res.data.userCashFlow[i].cashFlow;
              res.data.userCashFlow[i].msg = " 你提现了一笔钱";
            } else if (res.data.userCashFlow[i].fromUserId == 0){
              res.data.userCashFlow[i].avatarUrl = "/image/icon/wannengxiaoyuan.jpg";
              res.data.userCashFlow[i].cashFlow = "+" + res.data.userCashFlow[i].cashFlow;
              res.data.userCashFlow[i].msg = res.data.userCashFlow[i].nickName + " 向你支付了一笔钱";
            }else{
              res.data.userCashFlow[i].cashFlow = "+" + res.data.userCashFlow[i].cashFlow;
              res.data.userCashFlow[i].msg = res.data.userCashFlow[i].nickName+" 向你支付了一笔钱";
            }
          }
          that.setData({ data: res.data.userCashFlow });
        } else {
          that.setData({ tishi: false });
        }
      }
    });
  },
  DateUtil:function(date){
    var xianzai = new Date();
    var date = new Date(date);
    if(xianzai.getFullYear()==date.getFullYear()&&xianzai.getMonth()==date.getMonth()&&xianzai.getDate()==date.getDate()){
      return "今天 /" + date.getHours() + ":" + date.getMinutes();
    }else{
      return date.getMonth()+1 +" - "+ date.getDate() + "/" + date.getHours() + ":" + date.getMinutes();
    }
  }
})