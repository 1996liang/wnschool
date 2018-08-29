// pages/selectSchool/selectSchool.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectSchoolHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo;
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        wx.hideLoading();
        that.setData({
          "userInfo": res.data
        })
        userInfo = res.data;
        console.log(res.data)
      }
    });
    wx.showLoading();
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
    this.setData({ schoolData: data, selectSchoolHidden: false,value:value });
  },
  send:function(){
    console.log(this.data.value)
    var userInfo = this.data.userInfo;
    console.log(userInfo)
    console.log(userInfo.id)
    var school = this.data.value;
    if(school==null||school==""){
      wx.showModal({
        title: '学校不能为空哦!',
        content: '',
        showCancel:false
      })
    }else{
    wx.request({
      url: 'https://api.wnschool.cn/user-userSchoolSave',
      data: {
        "user.id": userInfo.id,
        "user.school": school
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data == "success") {
          wx.showToast({
            title: "选择成功",
            success: function () {
              var userInfo = wx.getStorageSync("userInfo");
              userInfo.school = school;
              wx.setStorageSync('userInfo', userInfo);

              setTimeout(function () {
                wx.hideToast();
                wx.switchTab({
                  url: '/pages/run/run',
                })
              }, 2000)
            }
          })
        }
      }
    });
    }
  }
})