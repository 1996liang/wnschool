// pages/util/util.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    personal: true,
    "userInfo": null,
    selectSchoolHidden:true,
    value:""
  },
  onLoad: function (options) {
    const date = new Date()
    const years = []
    const months = []
    const days = []

    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }

    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }

    Page({
      data: {
        years: years,
        year: date.getFullYear(),
        months: months,
        month: 2,
        days: days,
        day: 2,
        year: date.getFullYear(),
        value: [9999, 1, 1],
      },
      bindChange: function (e) {
        const val = e.detail.value
        this.setData({
          year: this.data.years[val[0]],
          month: this.data.months[val[1]],
          day: this.data.days[val[2]]
        })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  getValue:function(options){
    var data = this.data.schoolData;
    var index = options.currentTarget.dataset.index;
    this.setData({ value: data[index], schoolData: [], selectSchoolHidden: true});
    console.log(this.data.value)
  },
  getMsg:function(options){
    var value = options.detail.value;
    var util = require('../../utils/chinaUniversityList.js');
    var schoolList = util.getSchoolList();
    var data = new Array();
    for (var i = 0; i < schoolList.length;i++){
      for(var j=0;j<schoolList[i].school.length;j++){
        var name = schoolList[i].school[j].name;
        if(name.indexOf(value)>=0){
          // console.log(name)
          data.push(name);
        }
      }
    }
    this.setData({ schoolData: data, selectSchoolHidden:false});
  }
})