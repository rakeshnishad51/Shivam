const fs = require("fs");
module.exports.config = {
  name: "arif aa gya",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "ARIF BABU", 
  description: "hihihihi",
  commandCategory: "no prefix",
  usages: "arif",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (event.body.indexOf("Arif")==0 || event.body.indexOf("arif")==0 || event.body.indexOf("Arif babu")==0 || event.body.indexOf("ARIF")==0) {
    var msg = {
        body: "मुझे मेरे आरिफ बाबू बॉस ने बनाया है 😐",
        attachment: fs.createReadStream(__dirname + `/ARIF-BABU/dk.mp3`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😘", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
