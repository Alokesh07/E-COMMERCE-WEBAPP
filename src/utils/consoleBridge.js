import { sendLog } from './logger';

// Preserve originals
const _log = console.log.bind(console);
const _warn = console.warn.bind(console);
const _error = console.error.bind(console);

function safeSend(level, args) {
  try {
    const message = args.map(a => {
      try { return typeof a === 'string' ? a : JSON.stringify(a); } catch { return String(a); }
    }).join(' ');
    sendLog(level, message);
  } catch (e) {
    // don't break the app
  }
}

console.log = function (...args) {
  _log(...args);
  safeSend('info', args);
};

console.warn = function (...args) {
  _warn(...args);
  safeSend('warn', args);
};

console.error = function (...args) {
  _error(...args);
  safeSend('error', args);
};

export default {};
