const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    aliases: ["chatgpt", "ask"],
    version: "1.0",
    author: "ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ",
    countDown: 5,
    role: 0,
    shortDescription: "Répond aux questions",
    longDescription: "Utilise une API gratuite pour répondre aux questions des utilisateurs",
    category: "AI",
    guide: "{pn} <question>"
  },

  onStart: async function ({ api, event, args }) {
    const question = args.join(" ");
    if (!question) return api.sendMessage("⚠️ Pose-moi une question.", event.threadID, event.messageID);

    try {
      // Exemple avec une API gratuite (HuggingFace)
      const res = await axios.post("https://delfaapiai.vercel.app/ai/chatgptfree?prompt=salut+comment+vas+-+tu%3F&model=chatgpt4", {
        inputs: question
      }, {
        headers: { Authorization: "Bearer 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" }
      });

      const answer = res.data[0]?.generated_text || "Je n’ai pas trouvé de réponse.";
      api.sendMessage(answer, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("❌ Erreur lors de la requête AI.", event.threadID, event.messageID);
      console.error(err);
    }
  }
};
