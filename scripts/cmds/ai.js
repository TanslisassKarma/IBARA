const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    aliases: ["ask"],
    version: "1.0",
    author: "ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ",
    countDown: 5,
    role: 0,
    shortDescription: "Répond aux questions",
    longDescription: "Utilise Delfa API ChatGPTFree pour répondre",
    category: "AI",
    guide: "{pn} <question>"
  },

  onStart: async function ({ api, event, args }) {
    const question = args.join(" ");
    if (!question) return api.sendMessage("⚠️ Pose-moi une question.", event.threadID, event.messageID);

    try {
      const res = await axios.post("https://delfaapiai.vercel.app/ai/chatgptfree?prompt=peut+tu+compter+jusqu%27a+100%3F&model=chatgpt3", {
        prompt: question
      });

      const answer = res.data?.response || "Je n’ai pas trouvé de réponse.";
      api.sendMessage(answer, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("❌ Erreur lors de la requête AI.", event.threadID, event.messageID);
      console.error(err.response?.data || err.message);
    }
  }
};
