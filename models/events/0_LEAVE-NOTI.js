module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "ARIF BABU",
  description: "Member left notification with image",
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  try {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];

    const { threadID } = event;
    const leftID = event.logMessageData.leftParticipantFbId;

    // 🤖 bot leave ignore
    if (leftID == api.getCurrentUserID()) return;

    const time = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata"
    });

    const date = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata"
    });

    const hour = new Date().getHours();
    const session =
      hour < 12 ? "Morning" :
      hour < 17 ? "Afternoon" :
      hour < 21 ? "Evening" : "Night";

    const info = await api.getThreadInfo(threadID);
    const groupName = info.threadName || "Group Chat";
    const totalLeft = info.participantIDs.length;

    const name =
      global.data.userName.get(leftID) ||
      await Users.getNameUser(leftID);

    const type =
      event.author == leftID
        ? "Left by self"
        : "Removed by admin";

    /* 🖼️ IMGUR LINKS */
    const links = [
      "https://i.imgur.com/cClvBAQ.jpg",
      "https://i.imgur.com/cClvBAQ.jpg",
      "https://i.imgur.com/cClvBAQ.jpg"
    ];

    const imgPath = __dirname + "/cache/leave.jpg";
    const randomImg = links[Math.floor(Math.random() * links.length)];

    const msg =
`┏━━━━━━━━━━━━━━━┓
┃ 👤 NAME : ${name}
┃ 📝 KARAN : ${type}

┃ 🕒 ${session} ME ${time}
┃ 📅 DATE : ${date}

┃ 🏰 GROUP : ${groupName}
┃ 👥 MEMBER : ${totalLeft}
┗━━━━━━━━━━━━━━━┛`;

    return request(randomImg)
      .pipe(fs.createWriteStream(imgPath))
      .on("close", () => {
        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(imgPath)
          },
          threadID,
          () => fs.unlinkSync(imgPath)
        );
      });

  } catch (err) {
    console.log("LEAVE ERROR:", err);
  }
};