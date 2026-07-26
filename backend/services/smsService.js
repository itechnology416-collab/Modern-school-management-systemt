// SMS Gateway Service — Twilio / MSG91 / AWS SNS
// Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
let twilioClient = null;
try { twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); } catch(e) { /* twilio not installed */ }

const isConfigured = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, message) => {
  if (!isConfigured()) { console.log('[SMS] Gateway not configured — message not sent:', { to, message: message.substring(0, 50) }); return { success: false, error: 'Gateway not configured', simulated: true }; }
  try {
    const result = await twilioClient.messages.create({ body: message, from: process.env.TWILIO_PHONE_NUMBER, to });
    return { success: true, sid: result.sid };
  } catch (err) { console.error('[SMS] Send failed:', err.message); return { success: false, error: err.message }; }
};

const sendBulkSMS = async (recipients, message, templateVars = {}) => {
  const results = [];
  for (const r of recipients) {
    let msg = message;
    Object.entries(templateVars).forEach(([key, val]) => { msg = msg.replace(new RegExp(`\\{${key}\\}`, 'g'), typeof val === 'function' ? val(r) : val); });
    results.push({ phone: r.phone || r, name: r.name, result: await sendSMS(r.phone || r, msg) });
  }
  return results;
};

module.exports = { sendSMS, sendBulkSMS, isConfigured };
