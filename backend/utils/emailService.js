const nodemailer = require('nodemailer');
const User = require('../models/User');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@shopx.local';
const FROM_NAME = process.env.FROM_NAME || 'ShopX';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  } else {
    // No SMTP configured — create a fake transporter that logs messages
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('--- Email (simulated) ---');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('HTML:', mailOptions.html);
        console.log('-------------------------');
        return Promise.resolve();
      }
    };
  }

  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  try {
    const t = getTransporter();
    const result = await t.sendMail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      text,
      html
    });
    return result;
  } catch (err) {
    console.error('Email send error:', err);
    throw err;
  }
}

// Convenience: send order confirmation
async function sendOrderConfirmation(toEmail, order) {
  if (!toEmail) return;
  const subject = `Order ${order.orderId} placed — ${order.total}`;
  const text = `Hi,\n\nYour order ${order.orderId} has been placed. Total: ${order.total}.\n\nThank you for shopping with us.`;
  const html = `<p>Hi,</p><p>Your order <strong>${order.orderId}</strong> has been placed. <br/>Total: <strong>${order.total}</strong>.</p><p>Thank you for shopping with us.</p>`;
  try { await sendMail({ to: toEmail, subject, text, html }); } catch (e) { console.error(e); }
}

// Convenience: send order status update
async function sendOrderStatusUpdate(toEmail, order, status) {
  if (!toEmail) return;
  const subject = `Order ${order.orderId} status: ${status}`;
  const text = `Your order ${order.orderId} status has been updated to ${status}.`;
  const html = `<p>Your order <strong>${order.orderId}</strong> status has been updated to <strong>${status}</strong>.</p>`;
  try { await sendMail({ to: toEmail, subject, text, html }); } catch (e) { console.error(e); }
}

// Announcement for a new product — send to all users (email only)
async function sendProductAnnouncementToAll(product) {
  try {
    // Fetch emails in batches
    const cursor = User.find({ email: { $exists: true, $ne: '' } }).select('email name').cursor();
    for await (const u of cursor) {
      const to = u.email;
      if (!to) continue;
      const subject = `New Product: ${product.name}`;
      const text = `Hi ${u.name || ''},\n\nWe just added a new product: ${product.name}. Check it out!`;
      const html = `<p>Hi ${u.name || ''},</p><p>We just added a new product: <strong>${product.name}</strong>. <br/>Price: ${product.price}</p><p><a href="${product.url || '/'}">View product</a></p>`;
      // Do not await each send to avoid long blocking — fire-and-forget but catch errors
      sendMail({ to, subject, text, html }).catch(err => console.error('Announcement send error', err));
    }
  } catch (err) {
    console.error('sendProductAnnouncementToAll error', err);
  }
}

module.exports = {
  sendMail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendProductAnnouncementToAll
};
