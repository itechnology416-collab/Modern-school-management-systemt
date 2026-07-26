// Payment Gateway Service — Razorpay / Stripe
// Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET in .env
let razorpay = null;
try { const Razorpay = require('razorpay'); razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }); } catch(e) { /* razorpay not installed */ }

const isConfigured = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && razorpay);

const createOrder = async (amount, receipt, notes = {}) => {
  if (!isConfigured()) { console.log('[Payment] Not configured — simulated order:', { amount, receipt }); return { success: false, error: 'Gateway not configured', simulated: true, orderId: 'sim_' + Date.now() }; }
  try {
    const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt, notes });
    return { success: true, orderId: order.id, amount: order.amount, currency: order.currency };
  } catch (err) { console.error('[Payment] Order failed:', err.message); return { success: false, error: err.message }; }
};

const verifyPayment = (orderId, paymentId, signature) => {
  if (!isConfigured()) return { success: true, simulated: true };
  try {
    const crypto = require('crypto');
    const generated = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    return { success: generated === signature };
  } catch (err) { return { success: false, error: err.message }; }
};

module.exports = { createOrder, verifyPayment, isConfigured };
