//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.getUserInfo();
  },
  getUserInfo:function(){
    var that = this
    if (wx.getStorageSync("userInfo")){
    }else{
      //调用登录接口
      wx.login({
        success: function (res1) {
          var code = res1.code;
          wx.getUserInfo({
            success: function (res1) {
              console.log(res1)
              that.globalData.userInfo = res1.userInfo
                wx.request({
                  url: 'https://api.wnschool.cn/user-save',
                  data: {
                    "code":code,
                    "clientJSONString": JSON.stringify(res1.userInfo)
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method:'POST',
                  success:function(res){
                    console.log(res)
                    if(res.data!="code is null"){
                      console.log(res);
                      that.globalData.userInfo.openid = res.data.openid;
                      that.globalData.userInfo.id = res.data.id;
                      wx.setStorageSync('userInfo', res.data);
                    }
                  }
               })
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})