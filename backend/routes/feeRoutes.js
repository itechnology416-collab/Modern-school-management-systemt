const express = require('express');
const Fee = require('../models/Fee');
const { getFees, getFeeById, createFee, bulkCreateFee, collectFee, getPendingFees, getMyFees, updateFee, deleteFee } = require('../controllers/feeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const router = express.Router();

router.get('/', protect, getFees);
router.get('/pending', protect, getPendingFees);
router.get('/my', protect, authorize('student', 'parent'), getMyFees);
router.get('/reports', protect, authorize('admin'), async (req, res) => {
  try {
    const match = { schoolId: req.user.schoolId };
    const summary = await Fee.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' }, collectedAmount: { $sum: '$paidAmount' } } }
    ]);
    const classWise = await Fee.aggregate([
      { $match: match },
      { $group: { _id: '$classId', totalFees: { $sum: '$totalAmount' }, collectedFees: { $sum: '$paidAmount' }, pendingFees: { $sum: { $subtract: ['$totalAmount', '$paidAmount'] } } } },
      { $lookup: { from: 'classes', localField: '_id', foreignField: '_id', as: 'classInfo' } },
      { $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true } },
      { $project: { className: { $concat: ['$classInfo.name', ' ', '$classInfo.section'] }, totalFees: 1, collectedFees: 1, pendingFees: 1, collectionPercentage: { $round: [{ $multiply: [{ $divide: ['$collectedFees', '$totalFees'] }, 100] }, 1] } } }
    ]);
    res.json({ summary, classWise });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});
router.get('/:id', protect, getFeeById);
router.post('/', protect, authorize('admin'), createFee);
router.post('/bulk', protect, authorize('admin'), bulkCreateFee);
router.post('/:id/collect', protect, authorize('admin'), collectFee);
router.put('/:id', protect, authorize('admin'), updateFee);
router.delete('/:id', protect, authorize('admin'), deleteFee);

module.exports = router;
