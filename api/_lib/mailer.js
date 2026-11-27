const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  const user = (process.env.GMAIL_USER || 'yiwuleofaux@gmail.com').trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();

  if (!pass) {
    throw new Error('GMAIL_APP_PASSWORD is not configured in Vercel Environment Variables.');
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return { transporter: cachedTransporter, user };
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[m]));
}

async function sendLeadEmail({ to, subject, text, customerName }) {
  const { transporter, user } = getTransporter();
  const finalSubject = (subject || '').trim() || 'Leo Faux Wholesale Catalog & Inquiry Follow-up';
  const bodyHtml = escapeHtml(text || '').replace(/\r?\n/g, '<br>');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #1f2937; line-height: 1.65; max-width: 640px;">
      <div style="font-size: 15px;">${bodyHtml}</div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 16px;" />
      <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
        <strong style="color: #111827;">Leo Faux — Artificial Flowers Manufacturer &amp; Wholesale Supplier</strong><br/>
        WhatsApp / Phone: <a href="https://wa.me/8618657926791" style="color: #059669; text-decoration: none;">+86 186 5792 6791</a><br/>
        Website: <a href="https://www.leofaux.com/shop.html" style="color: #2563eb; text-decoration: none;">www.leofaux.com</a><br/>
        Yiwu Showroom: Shop 1088, 1F Commercial Street, T6 Office Building, Global Digital Trade Center (District 6, Yiwu International Trade City), Yiwu, Jinhua, Zhejiang, China
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Leo Faux Wholesale" <${user}>`,
    to,
    replyTo: user,
    subject: finalSubject,
    text: `${text}\n\n--\nLeo Faux Wholesale\nWhatsApp: +86 186 5792 6791\nWebsite: https://www.leofaux.com`,
    html,
  });

  return { messageId: info.messageId, from: user };
}

module.exports = { sendLeadEmail };
