module.exports.config = {
  name: "pair",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU ",
  description: "Hum Tum pair dp (blue ring style)",
  usePrefix: true,
  commandCategory: "Giải trí",
  usages: "[reply | mention | random]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const { createCanvas, loadImage } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");

  const cache = __dirname + "/cache/";
  if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });

  const outPath = cache + "gf_pair.png";
  const a1Path = cache + "a1.png";
  const a2Path = cache + "a2.png";

  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);

  let id2;

  if (event.messageReply?.senderID) {
    id2 = event.messageReply.senderID;
  }

  else if (event.mentions && Object.keys(event.mentions).length === 1) {
    id2 = Object.keys(event.mentions)[0];
  }

  else {
    const info = await api.getThreadInfo(event.threadID);
    let members = info.participantIDs.filter(
      id => id !== id1 && id !== api.getCurrentUserID()
    );
    if (!members.length)
      return api.sendMessage(
        "❌ Group me koi aur member nahi hai.",
        event.threadID,
        event.messageID
      );
    id2 = members[Math.floor(Math.random() * members.length)];
  }

  if (!id2)
    return api.sendMessage("❌ Pair nahi mila.", event.threadID, event.messageID);

  const name2 = await Users.getNameUser(id2);

  // ===== FACEBOOK TOKEN (FIXED) =====
  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

  // ===== DOWNLOAD AVATARS =====
  const av1 = await axios.get(
    `https://graph.facebook.com/${id1}/picture?type=large&access_token=${token}`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(a1Path, av1.data);

  const av2 = await axios.get(
    `https://graph.facebook.com/${id2}/picture?type=large&access_token=${token}`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(a2Path, av2.data);

  // ===== CANVAS =====
  const W = 1920;
  const H = 1080;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const img1 = await loadImage(a1Path);
  const img2 = await loadImage(a2Path);

  const r = 230;
  const y = H / 2;
  const x1 = W * 0.3;
  const x2 = W * 0.7;

  drawCircle(ctx, img1, x1, y, r);
  drawCircle(ctx, img2, x2, y, r);

  blueRing(ctx, x1, y, r + 10);
  blueRing(ctx, x2, y, r + 10);

  // ===== TOP TEXT =====
  ctx.textAlign = "center";
  ctx.font = "bold 110px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("I", W / 2 - 140, 160);
  ctx.fillStyle = "red";
  ctx.fillText("❤", W / 2, 160);
  ctx.fillStyle = "#000000";
  ctx.fillText("YOU", W / 2 + 170, 160);

  // ===== BOTTOM TEXT =====
  ctx.font = "bold 160px Arial";
  ctx.fillText("Húm Túm", W / 2, H - 120);

  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
  fs.unlinkSync(a1Path);
  fs.unlinkSync(a2Path);

  return api.sendMessage(
    {
      body: `${name1} ᥫ᭡ ${name2}`,
      mentions: [{ id: id2, tag: name2 }],
      attachment: fs.createReadStream(outPath)
    },
    event.threadID,
    () => fs.unlinkSync(outPath),
    event.messageID
  );
};

// ================= FUNCTIONS =================

function drawCircle(ctx, img, x, y, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

function blueRing(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = "#1e5bff";
  ctx.lineWidth = 18;
  ctx.shadowColor = "#4da6ff";
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
