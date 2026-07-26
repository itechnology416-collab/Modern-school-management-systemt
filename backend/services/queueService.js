// Simple in-memory job queue for batch operations (SMS/Email/Notifications)
class Queue {
  constructor() { this.jobs = []; this.running = false; this.concurrency = 3; }
  add(fn) { return new Promise((resolve, reject) => { this.jobs.push({ fn, resolve, reject }); this.process(); }); }
  async process() { if (this.running) return; this.running = true; while (this.jobs.length > 0) { const batch = this.jobs.splice(0, this.concurrency); await Promise.all(batch.map(j => j.fn().then(j.resolve).catch(j.reject))); } this.running = false; }
}

const queue = new Queue();

// Bulk send with queue — avoids blocking
const bulkSend = async (recipients, senderFn, onProgress = null) => {
  const results = []; let completed = 0;
  const promises = recipients.map(r => queue.add(async () => { const res = await senderFn(r); results.push({ recipient: r, result: res }); completed++; if (onProgress) onProgress(completed, recipients.length); return res; }));
  await Promise.all(promises);
  return results;
};

module.exports = { bulkSend, queue };
