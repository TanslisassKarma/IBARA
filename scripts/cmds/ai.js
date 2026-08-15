const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "2.1",
    author: "ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ",
    countDown: 5,
    role: 0,
    shortDescription: "Pose une question à l'IA",
    longDescription: "Discute avec une intelligence artificielle en continu",
    category: "ai",
    guide: "{pn} <question>"
  },

  // Commande directe
  onStart: async function ({ api, event, args }) {
    const question = args.join(" ").trim();

    if (!question) {
      return api.sendMessage(
        "❌ Utilisation : ai <ta question> et parle vite j'ai pas toute la journée😾",
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

      // On enregistre le contexte pour les réponses suivantes
      global.aiContext = { lastQuestion: question, lastAnswer: answer };

      return api.editMessage(`🤖 ${answer}`, message.messageID, (err, info) => {
        if (!err) {
          // On attache un handler onReply
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "reply"
          });
        }
      });
    } catch (error) {
      console.error(error);
      return api.editMessage(
        "❌ Impossible de contacter l'API pour le moment.",
        message.messageID
      );
    }
  },

  // Gestion des réponses (reply)
  onReply: async function ({ api, event, Reply }) {
    const question = event.body ? event.body.trim() : "";

    if (!question) {
      return api.sendMessage(
        "❌ Merci d'écrire ta question en réponse à mon message.",
        event.threadID,
        event.messageID
      );
    }

    const message = await api.sendMessage("⏳ Je réfléchis...", event.threadID);

    try {
      // On ajoute le contexte précédent si disponible
      let prompt = question;
      if (global.aiContext && global.aiContext.lastAnswer) {
        prompt =
          "Contexte précédent: " +
          global.aiContext.lastAnswer +
          "\nNouvelle question: " +
          question;
      }

      const url =
        "https://delfaapiai.vercel.app/ai/chatgptfree?prompt=" +
        encodeURIComponent(prompt);

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

      // Mise à jour du contexte
      global.aiContext = { lastQuestion: question, lastAnswer: answer };

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
