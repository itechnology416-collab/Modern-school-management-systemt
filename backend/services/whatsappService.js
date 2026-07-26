// WhatsApp Business API Service — Meta Cloud API
// Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_ID in .env
const axios = require('axios');

const isConfigured = () => !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID);

const sendMessage = async (to, message) => {
  if (!isConfigured()) { console.log('[WhatsApp] Not configured — message not sent:', { to, message: message.substring(0, 50) }); return { success: false, error: 'Not configured', simulated: true }; }
  try {
    const { data } = await axios.post(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      messaging_product: 'whatsapp', to, type: 'text', text: { body: message },
    }, { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' } });
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err) { console.error('[WhatsApp] Send failed:', err.response?.data || err.message); return { success: false, error: err.response?.data?.error?.message || err.message }; }
};

module.exports = { sendMessage, isConfigured };
