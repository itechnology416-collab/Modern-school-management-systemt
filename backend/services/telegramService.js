// Telegram Bot API Service
// Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env
const axios = require('axios');

const isConfigured = () => !!(process.env.TELEGRAM_BOT_TOKEN);

const sendMessage = async (chatId, message) => {
  if (!isConfigured()) { console.log('[Telegram] Not configured — message not sent:', { chatId, message: message.substring(0, 50) }); return { success: false, error: 'Not configured', simulated: true }; }
  try {
    const { data } = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { chat_id: chatId, text: message, parse_mode: 'HTML' });
    return { success: true, messageId: data.result?.message_id };
  } catch (err) { return { success: false, error: err.response?.data?.description || err.message }; }
};

const sendToChannel = async (channelId, message) => sendMessage(channelId, message);

module.exports = { sendMessage, sendToChannel, isConfigured };
