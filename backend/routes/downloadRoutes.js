const express = require('express');
const router = express.Router();
const { generateReportCard, generateFeeReceipt, generateCertificate } = require('../utils/pdfGenerator');
const { generateCSVBuffer } = require('../utils/csvExport');
const { protect } = require('../middleware/auth');

// @desc    Download report card PDF
// @route   POST /api/download/report-card
router.post('/report-card', protect, async (req, res) => {
  try {
    const { studentName, className, examName, subjects } = req.body;
    const pdfBuffer = await generateReportCard(studentName, className, examName, subjects);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-card-${studentName.replace(/\s/g,'-')}.pdf`);
    res.send(pdfBuffer);
  } catch (err) { res.status(500).json({ message: 'PDF generation failed' }); }
});

// @desc    Download fee receipt PDF
// @route   POST /api/download/fee-receipt
router.post('/fee-receipt', protect, async (req, res) => {
  try {
    const { studentName, feeName, amount, paidAmount, date, transactionId } = req.body;
    const pdfBuffer = await generateFeeReceipt(studentName, feeName, amount, paidAmount, date, transactionId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=fee-receipt-${studentName.replace(/\s/g,'-')}.pdf`);
    res.send(pdfBuffer);
  } catch (err) { res.status(500).json({ message: 'PDF generation failed' }); }
});

// @desc    Download certificate PDF
// @route   POST /api/download/certificate
router.post('/certificate', protect, async (req, res) => {
  try {
    const { studentName, title, content } = req.body;
    const pdfBuffer = await generateCertificate(studentName, title, content);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${studentName.replace(/\s/g,'-')}.pdf`);
    res.send(pdfBuffer);
  } catch (err) { res.status(500).json({ message: 'Certificate generation failed' }); }
});

// @desc    Export data as CSV
// @route   POST /api/download/csv
router.post('/csv', protect, async (req, res) => {
  try {
    const { data, columns, filename } = req.body;
    const csvBuffer = generateCSVBuffer(data, columns);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename || 'export'}.csv`);
    res.send(csvBuffer);
  } catch (err) { res.status(500).json({ message: 'Export failed' }); }
});

module.exports = router;
