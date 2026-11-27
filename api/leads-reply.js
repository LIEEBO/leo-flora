const { supabaseRest, authenticateRequest, setCors, parseBody } = require('./_lib/supabase');
const { sendLeadEmail } = require('./_lib/mailer');

const ALLOWED_CHANNELS = new Set(['email', 'ai_email', 'whatsapp', 'note']);
const ALLOWED_STATUSES = new Set(['new', 'ai_following', 'replied', 'qualified', 'won', 'invalid']);

module.exports = async (req, res) => {
  setCors(res, 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  const auth = await authenticateRequest(req);
  if (!auth.authorized) {
    return res.status(401).json({ ok: false, error: 'Unauthorized. Provide x-api-key or admin Bearer token.' });
  }

  try {
    const body = parseBody(req);
    const leadId = String(body.lead_id || '').trim();
    const channel = ALLOWED_CHANNELS.has(body.channel) ? body.channel : (auth.actor === 'ai' ? 'ai_email' : 'email');
    const subject = String(body.subject || '').trim();
    const content = String(body.content || '').trim();
    const sender = body.sender || auth.actor;

    if (!leadId || !content) {
      return res.status(400).json({ ok: false, error: 'lead_id and content are required.' });
    }

    // 读取目标客户信息
    const leadRes = await supabaseRest(`customer_leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1`, {
      token: auth.actor === 'admin' ? auth.token : null,
      useServiceRole: auth.actor === 'ai',
    });
    if (!leadRes.ok || !Array.isArray(leadRes.data) || leadRes.data.length === 0) {
      return res.status(404).json({ ok: false, error: 'Lead not found.' });
    }
    const lead = leadRes.data[0];

    let deliveryStatus = 'logged';
    let errorMessage = null;
    let mailInfo = null;

    if (channel === 'email' || channel === 'ai_email') {
      const targetEmail = (lead.email || (lead.contact && lead.contact.includes('@') ? lead.contact : '') || '').trim();
      if (!targetEmail || !targetEmail.includes('@')) {
        return res.status(400).json({ ok: false, error: 'This customer does not have a valid email address.' });
      }
      try {
        mailInfo = await sendLeadEmail({
          to: targetEmail,
          subject: subject || `Hello ${lead.name || 'Friend'} — Leo Faux Wholesale Catalog & Quote`,
          text: content,
          customerName: lead.name || '',
        });
        deliveryStatus = 'sent';
      } catch (mailErr) {
        deliveryStatus = 'failed';
        errorMessage = mailErr.message;
      }
    }

    // 写入 lead_replies 历史记录
    const replyInsert = await supabaseRest('lead_replies', {
      method: 'POST',
      body: {
        lead_id: leadId,
        channel,
        direction: 'outbound',
        sender,
        subject: subject || null,
        content,
        delivery_status: deliveryStatus,
        error_message: errorMessage,
      },
      prefer: 'return=representation',
      token: auth.actor === 'admin' ? auth.token : null,
      useServiceRole: auth.actor === 'ai',
    });

    if (deliveryStatus === 'failed') {
      return res.status(502).json({
        ok: false,
        error: `Email send failed: ${errorMessage}`,
        reply: Array.isArray(replyInsert.data) ? replyInsert.data[0] : null,
      });
    }

    // 自动更新客户状态与回复计数（note 不改变未回复状态，除非显式传 new_status）
    const nextStatus =
      body.new_status && ALLOWED_STATUSES.has(body.new_status)
        ? body.new_status
        : channel === 'note'
          ? lead.status
          : auth.actor === 'ai'
            ? (lead.status === 'new' ? 'ai_following' : lead.status)
            : (lead.status === 'new' || lead.status === 'ai_following' ? 'replied' : lead.status);

    const leadPatch = {
      status: nextStatus,
    };
    if (channel !== 'note') {
      leadPatch.reply_count = (lead.reply_count || 0) + 1;
      leadPatch.last_reply_at = new Date().toISOString();
      leadPatch.last_reply_by = sender;
    }

    const updLead = await supabaseRest(`customer_leads?id=eq.${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      body: leadPatch,
      prefer: 'return=representation',
      token: auth.actor === 'admin' ? auth.token : null,
      useServiceRole: auth.actor === 'ai',
    });

    return res.status(200).json({
      ok: true,
      delivery_status: deliveryStatus,
      mail: mailInfo,
      reply: Array.isArray(replyInsert.data) ? replyInsert.data[0] : null,
      lead: Array.isArray(updLead.data) ? updLead.data[0] : null,
    });
  } catch (err) {
    console.error('api/leads-reply error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
