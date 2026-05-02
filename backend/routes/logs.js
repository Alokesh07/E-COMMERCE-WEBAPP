const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const LOG_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB rotate threshold

function rotateIfNeeded() {
  try {
    if (!fs.existsSync(LOG_FILE)) return;
    const { size } = fs.statSync(LOG_FILE);
    if (size >= MAX_BYTES) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const rotated = path.join(LOG_DIR, `app-${ts}.log`);
      fs.renameSync(LOG_FILE, rotated);
      // create new empty log file
      fs.writeFileSync(LOG_FILE, ``);
      console.log('Rotated log file to', rotated);
    }
  } catch (err) {
    console.error('Failed during log rotation check:', err);
  }
}

router.post('/', (req, res) => {
  const { level = 'info', message = '', ts = new Date().toISOString() } = req.body || {};
  try {
    rotateIfNeeded();
    const line = `[${ts}] [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, line);
    return res.status(201).json({ message: 'Logged' });
  } catch (err) {
    console.error('Failed to write log:', err);
    return res.status(500).json({ message: 'Failed to write log' });
  }
});

// optional: expose a route to trigger manual rotation
router.post('/rotate', (req, res) => {
  try {
    rotateIfNeeded();
    return res.json({ message: 'Rotation checked' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
