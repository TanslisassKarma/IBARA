const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.1",
    author: "ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ",
    countDown: 5,
    role: 0,
    shortDescription: "Pose une question à l'IA",
    longDescription: "Discute avec une intelligence artificielle",
    category: "ai",
    guide: "{pn} <question> ou réponds à mon message"
  },

  onStart: async function ({ api, event, args }) {
    let question = args.join(" ").trim();

    // Si l'utilisateur répond à un message du bot
    if (!question && event.messageReply && event.body) {
      question = event.body.trim();
    }

    if (!question) {
      return api.sendMessage(
        "❌ Utilisation : ai <ta question> ou réponds à mon message avec ta question",
        event.threadID,
        event.messageID
      );
    }

    const message = await api.sendMessage("⏳ Je réfléchis...", event.threadID);

    try {
      const url =
        "https://delfaapiai.vercel.app/ai/chatgptfree?prompt=" +
        encodeURIComponent(question);

      const response = await axios.get(url, { timeout: 30000 });
      const data = response.data;

      const answer =
        data.response ||
        data.answer ||
        data.message ||
        data.result ||
        data.text ||
        (typeof data === "string" ? data : null);

      if (!answer) throw new Error("Réponse invalide de l'API");

      return api.editMessage(`🤖 ${answer}`, message.messageID);
    } catch (error) {
      console.error(error);
      return api.editMessage(
        "❌ Impossible de contacter l'API pour le moment.",
        message.messageID
      );
    }
  }
};
