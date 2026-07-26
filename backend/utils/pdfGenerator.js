const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate Report Card PDF
const generateReportCard = (studentName, className, examName, subjects) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text('REPORT CARD', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`${examName}`, { align: 'center' });
    doc.moveDown(0.3);
    doc.text(`Student: ${studentName}    |    Class: ${className}`, { align: 'center' });
    doc.moveDown(1);

    // Draw table header
    const startY = doc.y;
    const colX = [40, 200, 320, 420, 500];
    const drawRow = (y, data, isHeader = false) => {
      if (isHeader) {
        doc.rect(40, y - 4, 520, 22).fill('#1a2744');
        doc.fillColor('#ffffff').font('Helvetica-Bold');
      } else {
        doc.fillColor('#000000').font('Helvetica');
      }
      doc.fontSize(10).text(data[0] || '', colX[0], y, { width: 150 });
      doc.text(data[1] || '', colX[1], y, { width: 100, align: 'center' });
      doc.text(data[2] || '', colX[2], y, { width: 80, align: 'center' });
      doc.text(data[3] || '', colX[3], y, { width: 60, align: 'center' });
      doc.text(data[4] || '', colX[4], y, { width: 50, align: 'center' });
      return y + 20;
    };

    let y = drawRow(startY, ['Subject', 'Marks Obtained', 'Max Marks', 'Grade', '%'], true);

    // Subject rows
    let totalObtained = 0, totalMax = 0;
    subjects.forEach((sub, i) => {
      if (i % 2 === 0) {
        doc.rect(40, y - 4, 520, 20).fill('#f8fafc');
        doc.fillColor('#000000');
      }
      y = drawRow(y, [sub.name, String(sub.marks || '-'), String(sub.maxMarks || '-'), sub.grade || '-', sub.percentage || '-']);
      totalObtained += sub.marks || 0;
      totalMax += sub.maxMarks || 0;
    });

    // Total row
    doc.rect(40, y - 4, 520, 22).fill('#e2e8f0');
    doc.fillColor('#1a2744').font('Helvetica-Bold');
    y = drawRow(y, ['TOTAL', String(totalObtained), String(totalMax), '', totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) + '%' : '-']);
    doc.fillColor('#000000').font('Helvetica');

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.text('School Management System', { align: 'right', color: '#888' });

    doc.end();
  });
};

// Generate Fee Receipt PDF
const generateFeeReceipt = (studentName, feeName, amount, paidAmount, date, transactionId) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(24).font('Helvetica-Bold').text('FEE RECEIPT', { align: 'center' });
    doc.moveDown(0.5);
    doc.rect(50, doc.y, 495, 1).fill('#1a2744');
    doc.moveDown(1.5);

    const drawField = (label, value) => {
      doc.fontSize(11).font('Helvetica-Bold').text(label + ':', { continued: true });
      doc.font('Helvetica').text('  ' + value);
      doc.moveDown(0.3);
    };

    drawField('Student Name', studentName);
    drawField('Fee Type', feeName);
    drawField('Total Amount', '₹' + amount.toLocaleString());
    drawField('Paid Amount', '₹' + paidAmount.toLocaleString());
    drawField('Balance', '₹' + Math.max(0, amount - paidAmount).toLocaleString());
    drawField('Payment Date', new Date(date).toLocaleDateString());
    if (transactionId) drawField('Transaction ID', transactionId);

    doc.moveDown(1.5);
    doc.rect(50, doc.y, 495, 1).fill('#1a2744');
    doc.moveDown(1);
    doc.fontSize(9).text('This is a computer-generated receipt.', { align: 'center', color: '#888' });

    doc.end();
  });
};

// Generate Certificate PDF
const generateCertificate = (studentName, title, content) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: 'A4', layout: 'landscape' });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Decorative border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke('#1a2744');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke('#cbd5e1');

    doc.moveDown(2);
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#1a2744').text(title, { align: 'center' });
    doc.moveDown(2);

    const bodyContent = (content || 'This is to certify that {student} has successfully completed the requirements.').replace('{student}', studentName);
    doc.fontSize(16).font('Helvetica').fillColor('#334155').text(bodyContent, { align: 'center', width: 500 });
    doc.moveDown(3);

    doc.fontSize(12).font('Helvetica').fillColor('#64748b');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(3);
    doc.text('_________________________', { align: 'right' });
    doc.text('Authorized Signatory', { align: 'right' });

    doc.end();
  });
};

module.exports = { generateReportCard, generateFeeReceipt, generateCertificate };
