Page({
  data: {
    inTheaters: [],
    comingSoon: [],
    top250: [],
    searchResult: false,
    searchData: [],
    syncMessage: '',
    socketOpen: false, // Track socket connection status
    socketMessageQueue: [] // Queue for messages to be sent
  },
  onLoad: function() {
    this.connectWebSocket();
  },

  connectWebSocket: function() {
    const that = this;
    wx.connectSocket({
      url: 'wss://your-websocket-server-url', // Replace with your WebSocket server URL
      success() {
        console.log('WebSocket connection created');
      }
    });

    wx.onSocketOpen(function() {
      console.log('WebSocket connection opened');
      that.setData({ socketOpen: true });
      // Send any queued messages
      that.data.socketMessageQueue.forEach(message => {
        that.sendSocketMessage(message);
      });
      that.setData({ socketMessageQueue: [] });
    });

    wx.onSocketMessage(function(res) {
      console.log('Received message from server:', res.data);
      // Handle incoming messages
    });

    wx.onSocketError(function(error) {
      console.log('WebSocket error:', error);
    });

    wx.onSocketClose(function() {
      console.log('WebSocket connection closed');
      that.setData({ socketOpen: false });
    });
  },

  sendSocketMessage: function(message) {
    if (this.data.socketOpen) {
      wx.sendSocketMessage({
        data: message,
        success() {
          console.log('Message sent:', message);
        }
      });
    } else {
      // Queue the message if the socket is not open
      this.data.socketMessageQueue.push(message);
    }
  },

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
              // Example of sending a message after fetching steps
              that.sendSocketMessage(JSON.stringify({ type: 'steps', data: that.data.stepInfoList }));
            } 
          }) 
        }
      } 
    });
  }
})