const { supabaseRest, setCors, parseBody } = require('./_lib/supabase');
const { validateName, validateEmailStrict, validatePhoneStrict } = require('./_lib/validator');

function readGeo(req) {
  const country = req.headers['x-vercel-ip-country'] || null;
  const region = req.headers['x-vercel-ip-country-region'] || null;
  const cityRaw = req.headers['x-vercel-ip-city'] || null;
  let city = null;
  if (cityRaw) {
    try {
      city = decodeURIComponent(cityRaw);
    } catch {
      city = cityRaw;
    }
  }
  return { country, region, city };
}

async function notifyAiWebhook(eventType, lead) {
  const webhookUrl = (process.env.AI_WEBHOOK_URL || '').trim();
  if (!webhookUrl) return;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.AI_WEBHOOK_SECRET) {
      headers['x-webhook-secret'] = process.env.AI_WEBHOOK_SECRET;
    }
    await fetch(webhookUrl, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        event: eventType,
        timestamp: new Date().toISOString(),
        lead,
      }),
    });
    clearTimeout(timer);
  } catch (err) {
    console.error('AI webhook push failed:', err.message);
  }
}

module.exports = async (req, res) => {
  setCors(res, 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  try {
    const body = parseBody(req);
    const nameCheck = validateName(body.name);
    if (!nameCheck.ok) return res.status(400).json({ ok: false, field: 'name', error: nameCheck.error });

    const emailCheck = await validateEmailStrict(body.email);
    if (!emailCheck.ok) return res.status(400).json({ ok: false, field: 'email', error: emailCheck.error });

    const phoneCheck = validatePhoneStrict(body.phone);
    if (!phoneCheck.ok) return res.status(400).json({ ok: false, field: 'phone', error: phoneCheck.error });

    const interests = Array.isArray(body.product_interest)
      ? body.product_interest.map((s) => String(s || '').trim()).filter(Boolean).slice(0, 12)
      : [];
    const message = String(body.message || '').trim().slice(0, 1500);
    const geo = readGeo(req);

    // 统一 contact 摘要，兼容旧版展示
    const contactSummary = `${emailCheck.value} | ${phoneCheck.value}`;
    const nowIso = new Date().toISOString();

    // 先查是否已有同邮箱客户（避免重复创建）
    const existingRes = await supabaseRest(
      `customer_leads?select=id,status,reply_count&or=(email.eq.${encodeURIComponent(emailCheck.value)},contact.eq.${encodeURIComponent(emailCheck.value)},contact.eq.${encodeURIComponent(contactSummary)})&limit=1`
    );

    let savedLead = null;
    let isNewLead = false;

    if (existingRes.ok && Array.isArray(existingRes.data) && existingRes.data.length > 0) {
      const existing = existingRes.data[0];
      const patchPayload = {
        name: nameCheck.value,
        email: emailCheck.value,
        phone: phoneCheck.value,
        contact: contactSummary,
        last_seen_at: nowIso,
        country: geo.country,
        region: geo.region,
        city: geo.city,
      };
      if (interests.length > 0) patchPayload.product_interest = interests;
      if (message) patchPayload.message = message;

      const upd = await supabaseRest(`customer_leads?id=eq.${encodeURIComponent(existing.id)}`, {
        method: 'PATCH',
        body: patchPayload,
        prefer: 'return=representation',
      });
      savedLead = Array.isArray(upd.data) ? upd.data[0] : patchPayload;
    } else {
      isNewLead = true;
      const insertPayload = {
        name: nameCheck.value,
        email: emailCheck.value,
        phone: phoneCheck.value,
        contact: contactSummary,
        product_interest: interests,
        message: message || null,
        status: 'new',
        source: 'shop',
        country: geo.country,
        region: geo.region,
        city: geo.city,
        last_seen_at: nowIso,
      };

      const ins = await supabaseRest('customer_leads', {
        method: 'POST',
        body: insertPayload,
        prefer: 'return=representation',
      });

      if (!ins.ok) {
        console.error('Insert customer_leads failed:', ins.status, ins.data);
        return res.status(500).json({ ok: false, error: 'Database save failed. Please try again.' });
      }
      savedLead = Array.isArray(ins.data) ? ins.data[0] : insertPayload;
    }

    // 如果是新注册客户，推送给 AI Webhook（非阻塞超时控制）
    if (isNewLead && savedLead) {
      await notifyAiWebhook('lead.created', savedLead);
    }

    return res.status(200).json({
      ok: true,
      is_new: isNewLead,
      lead: {
        id: savedLead ? savedLead.id : null,
        name: nameCheck.value,
        email: emailCheck.value,
        phone: phoneCheck.value,
        contact: contactSummary,
      },
    });
  } catch (err) {
    console.error('register-lead error:', err);
    return res.status(500).json({ ok: false, error: 'Server error, please try again shortly.' });
  }
};
