/*
 * @Description: 
 * @LastEditTime: 2024-12-24 13:40:43
 */
// pages/movies/movies.js
const app = getApp()
var DataCrypt = require('./barry_cryptojs/Datacrypt.js');
const io = require('../weapp.socket.io/lib/weapp.socket.io');
const socket = io('ws://192.168.31.160:5000');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:[],
    comingSoon:[],
    top250:[],
    searchResult:false,
    searchData:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var that = this;

     wx.login({ 
       success: function (res) { 
         var appid = "wx1f7af5d438d65bdb"; 
         var secret = "8f43d19f7256bb05ef00803065fa3c22"; 
         if (res.code) { 
           wx.request({ 
             url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code', 
             header: { 'content-type': 'json' }, 
             success: function (res) {
                  var session_key = res.data.session_key; 
                  console.log("seccion_key:"+session_key); 
               that.getWeRunData(appid, session_key); } 
                   }) 
                  }
             } 
             }) 
   }, 
                   //获取encryptedData（没有解密的步数）和iv（加密算法的初始向量） 
  getWeRunData: function (appid,session_key) {
      var that=this
      wx.getSetting({ success: function (res) {
         console.log(res); 
         if (!res.authSetting['scope.werun']) 
         {
           wx.authorize({
             scope: 'scope.werun',
             success:()=>{
               console.log("授权测试成功！！！")
             }
           })
           wx.showLoading({
             title: '获取中',
           })
            wx.getWeRunData({ 
                 success: function (res) {
                    console.log(res); 
                    var encryptedData = res.encryptedData; 
                    var iv = res.iv;
                    var pc = new DataCrypt(appid, session_key); 
                    console.log(pc); 
                    var data = pc.decryptData(encryptedData, iv)
                    // Format the timestamp to a readable date
                    data.stepInfoList = data.stepInfoList.map(item => {
                      const date = new Date(item.timestamp * 1000); // Convert to milliseconds
                      item.formattedDate = date.toLocaleDateString(); // Format the date
                      return item;
                    });
                 that.setData({
                   stepInfoList: data.stepInfoList,
                   syncMessage: '数据已同步'
                 });
                 wx.hideLoading()
                 wx.showToast({
                   title: '数据已同步',
                 })
                 that.sendDataToBackend(that.data.stepInfoList)
                 },
                fail: function (res) { console.log("获取数据失败", res) }
            })
          
        } else {
          wx.showLoading({
            title: '获取中',
          })
               wx.getWeRunData({ 
                 success: function (res) {
                    console.log(res); 
                    var encryptedData = res.encryptedData; 
                    var iv = res.iv;
                    var pc = new DataCrypt(appid, session_key); 
                    console.log(pc); 
                    var data = pc.decryptData(encryptedData, iv)
                    console.log(data, 'data>>>>')
                   console.log("------" + data.stepInfoList[30].step)
                   // Format the timestamp to a readable date
                   data.stepInfoList = data.stepInfoList.map(item => {
                     const date = new Date(item.timestamp * 1000); // Convert to milliseconds
                     item.formattedDate = date.toLocaleDateString(); // Format the date
                     return item;
                   });
                 that.setData({
                   stepInfoList: data.stepInfoList,
                   syncMessage: '数据已同步'
                 });
                 wx.hideLoading()
                 wx.showToast({
                  title: '数据已同步',
                })
                that.sendDataToBackend(that.data.stepInfoList)
                 },
          fail: function (res) { console.log("获取数据失败") }
        })
      }
    }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onFetchSteps: function() {
    // Call the function to get WeRun data
    var appid = "wx1f7af5d438d65bdb"; 
    var secret = "8f43d19f7256bb05ef00803065fa3c22"; 
    var that = this;
    wx.login({ 
      success: function (res) { 
        if (res.code) { 
          wx.request({ 
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code', 
            header: { 'content-type': 'json' }, 
            success: function (res) {
              var session_key = res.data.session_key; 
              console.log("session_key:" + session_key); 
              that.getWeRunData(appid, session_key); 
            } 
          }) 
        }
      } 
    });
  },
  sendDataToBackend: function(data) {
    wx.request({
      url: 'http://192.168.31.160:5000/runData', // 替换为你的后端 URL
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: data,
      success: function(res) {
        console.log('数据发送成功:', res.data);
      },
      fail: function(error) {
        console.error('数据发送失败:', error);
      }
    });
  },
  onReceiveData: function(receivedData) {
    console.log('接收到的数据:', receivedData);
    // 发送数据到后端
    this.sendDataToBackend(receivedData);
  }
})