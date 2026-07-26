// SMS to Fee Defaulters — automated cron script
// Set up as scheduled task: 0 9 * * 1 (every Monday at 9 AM)
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { sendBulkSMS } = require('../services/smsService');

const notifyFeeDefaulters = async () => {
  console.log(`[FeeDefaulterCron] ${new Date().toISOString()} — Checking for fee defaulters...`);

  try {
    const overdueFees = await Fee.find({ status: 'overdue' })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name phone' } });

    const defaulters = [];
    const seen = new Set();
    for (const fee of overdueFees) {
      const sid = String(fee.studentId?._id);
      if (seen.has(sid)) continue;
      seen.add(sid);
      const student = fee.studentId;
      if (student?.userId?.phone) {
        defaulters.push({
          phone: student.userId.phone,
          name: student.userId.name || 'Parent',
          pendingAmount: fee.totalAmount - fee.paidAmount,
        });
      }
    }

    if (defaulters.length === 0) {
      console.log(`[FeeDefaulterCron] No defaulters with phone numbers found.`);
      return { sent: 0, total: overdueFees.length };
    }

    const results = await sendBulkSMS(defaulters, 
      'Dear {name}, your child has a pending fee of ₹{pendingAmount}. Please clear it at the earliest to avoid late charges. — School Management',
      { name: (r) => r.name, pendingAmount: (r) => r.pendingAmount }
    );

    const sent = results.filter(r => r.result.success).length;
    console.log(`[FeeDefaulterCron] Sent ${sent}/${defaulters.length} SMS to fee defaulters.`);
    return { sent, total: defaulters.length, results };
  } catch (err) {
    console.error(`[FeeDefaulterCron] Error:`, err.message);
    return { error: err.message };
  }
};

// Export for use in scheduled tasks
module.exports = notifyFeeDefaulters;

// Run directly if called: node scripts/notifyDefaulters.js
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  require('../config/db')();
  notifyFeeDefaulters().then(() => process.exit(0));
}
