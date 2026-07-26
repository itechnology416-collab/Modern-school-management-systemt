const fs = require('fs');
const path = require('path');

// Export array of data to CSV and return file path
const exportCSV = (data, columns, filename) => {
  const headers = columns.map(c => c.label || c.key).join(',');
  const rows = data.map(row => columns.map(c => {
    const val = typeof c.render === 'function' ? c.render(row) : row[c.key];
    const str = String(val ?? '').replace(/"/g, '""');
    return /[,"\n]/.test(str) ? `"${str}"` : str;
  }).join(','));

  const csv = [headers, ...rows].join('\n');
  const filePath = path.join(__dirname, '..', 'exports', `${filename}-${Date.now()}.csv`);

  // Ensure exports directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(filePath, csv);
  return filePath;
};

// Generate CSV buffer for download (no file write)
const generateCSVBuffer = (data, columns) => {
  const headers = columns.map(c => c.label || c.key).join(',');
  const rows = data.map(row => columns.map(c => {
    const val = typeof c.render === 'function' ? c.render(row) : row[c.key];
    const str = String(val ?? '').replace(/"/g, '""');
    return /[,"\n]/.test(str) ? `"${str}"` : str;
  }).join(','));

  return Buffer.from([headers, ...rows].join('\n'), 'utf-8');
};

module.exports = { exportCSV, generateCSVBuffer };
