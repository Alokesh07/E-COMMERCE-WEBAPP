// Simple client-side logger that posts logs to backend /api/logs
export async function sendLog(level, message) {
  try {
    await fetch(`${process.env.REACT_APP_API_BASE || ''}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, ts: new Date().toISOString() })
    });
  } catch (err) {
    // fallback to console if network logging fails
    console[level === 'error' ? 'error' : 'log']('sendLog failed', err);
  }
}

export default { sendLog };
