const moment = require("moment-timezone");

/* ================= SYSTEM BOX ================= */

function box(title, text) {
  return `╭──── ${title} ────╮\n\n${text}\n\n╰─────────────────╯`;
}

const PREFIX_BOX = (t) => box("〔 𝐏𝐫𝐞𝐟𝐢𝐱 〕", t);

/* ================= CONFIG ================= */

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Show bot prefix with time/date/day",
  commandCategory: "For admin",
  usages: "prefix",
  cooldowns: 5
};

/* ================= HANDLE EVENT ================= */

module.exports.handleEvent = async ({ event, api, Threads }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;

  // Credit protection
  if (module.exports.config.credits !== "ARIF BABU") {
    return api.sendMessage(
      PREFIX_BOX("⚠ Credits changed!"),
      threadID,
      messageID
    );
  }

  const time = moment.tz("Asia/Kolkata").format("hh:mm:ss A");
  const date = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
  const day  = moment.tz("Asia/Kolkata").format("dddd");

  const threadSetting =
    global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const triggers = [
    "prefix",
    "mprefix",
    "mpre",
    "dấu lệnh",
    "prefix của bot là gì",
    "daulenh",
    "duong"
  ];

  if (
    triggers.some(
      t =>
        body === t ||
        body === t.toUpperCase() ||
        body === t.charAt(0).toUpperCase() + t.slice(1)
    )
  ) {
    return api.sendMessage(
      PREFIX_BOX(
        `🔹 𝕻𝖗𝖊𝖋𝖎𝖝 : [ ${prefix} ]\n` +
        `🕒 𝕿𝖎𝖒𝖊  : ${time}\n` +
        `📅 𝕯𝖆𝖙𝖊  : ${date}\n` +
        `📆 𝕯𝖆𝖞  : ${day}`
      ),
      threadID,
      messageID
    );
  }
};

/* ================= COMMAND RUN ================= */

module.exports.run = async ({ event, api }) => {
  const time = moment.tz("Asia/Kolkata").format("hh:mm:ss A");
  const date = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
  const day  = moment.tz("Asia/Kolkata").format("dddd");

  return api.sendMessage(
    PREFIX_BOX(
      `🔹 𝕻𝖗𝖊𝖋𝖎𝖝 : [ ${global.config.PREFIX} ]\n` +
      `🕒 𝕿𝖎𝖒𝖊  : ${time}\n` +
      `📅 𝕯𝖆𝖙𝖊  : ${date}\n` +
      `📆 𝕯𝖆𝖞  : ${day}`
    ),
    event.threadID,
    event.messageID
  );
};
