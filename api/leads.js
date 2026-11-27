const { supabaseRest, authenticateRequest, setCors, parseBody } = require('./_lib/supabase');

const ALLOWED_STATUSES = new Set(['new', 'ai_following', 'replied', 'qualified', 'won', 'invalid']);

module.exports = async (req, res) => {
  setCors(res, 'GET,PATCH,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await authenticateRequest(req);
  if (!auth.authorized) {
    return res.status(401).json({ ok: false, error: 'Unauthorized. Provide x-api-key or admin Bearer token.' });
  }

  try {
    if (req.method === 'GET') {
      const { status, since, limit = '100', include_replies = '0', lead_id } = req.query || {};
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);

      const filters = ['select=*', 'order=created_at.desc', `limit=${safeLimit}`];
      if (lead_id) {
        filters.push(`id=eq.${encodeURIComponent(lead_id)}`);
      }
      if (status && ALLOWED_STATUSES.has(status)) {
        filters.push(`status=eq.${encodeURIComponent(status)}`);
      }
      if (since) {
        filters.push(`created_at=gte.${encodeURIComponent(since)}`);
      }

      const leadsRes = await supabaseRest(`customer_leads?${filters.join('&')}`, {
        token: auth.actor === 'admin' ? auth.token : null,
        useServiceRole: auth.actor === 'ai',
      });

      if (!leadsRes.ok) {
        return res.status(leadsRes.status).json({ ok: false, error: leadsRes.data });
      }

      const leads = Array.isArray(leadsRes.data) ? leadsRes.data : [];

      if (include_replies === '1' && leads.length > 0) {
        const ids = leads.map((l) => l.id).filter(Boolean);
        const repRes = await supabaseRest(
          `lead_replies?select=*&lead_id=in.(${ids.map(encodeURIComponent).join(',')})&order=created_at.asc`,
          {
            token: auth.actor === 'admin' ? auth.token : null,
            useServiceRole: auth.actor === 'ai',
          }
        );
        const repliesByLead = {};
        if (repRes.ok && Array.isArray(repRes.data)) {
          for (const r of repRes.data) {
            if (!repliesByLead[r.lead_id]) repliesByLead[r.lead_id] = [];
            repliesByLead[r.lead_id].push(r);
          }
        }
        for (const l of leads) {
          l.replies = repliesByLead[l.id] || [];
        }
      }

      return res.status(200).json({ ok: true, actor: auth.actor, count: leads.length, leads });
    }

    if (req.method === 'PATCH') {
      const body = parseBody(req);
      const leadId = String(body.lead_id || body.id || '').trim();
      if (!leadId) {
        return res.status(400).json({ ok: false, error: 'Missing lead_id.' });
      }

      const patch = {};
      if (body.status !== undefined) {
        if (!ALLOWED_STATUSES.has(body.status)) {
          return res.status(400).json({ ok: false, error: `Invalid status. Allowed: ${Array.from(ALLOWED_STATUSES).join(', ')}` });
        }
        patch.status = body.status;
      }
      if (body.notes !== undefined) patch.notes = String(body.notes || '');
      if (Array.isArray(body.product_interest)) patch.product_interest = body.product_interest;
      if (body.message !== undefined) patch.message = String(body.message || '');

      if (Object.keys(patch).length === 0) {
        return res.status(400).json({ ok: false, error: 'No updatable fields provided.' });
      }

      const upd = await supabaseRest(`customer_leads?id=eq.${encodeURIComponent(leadId)}`, {
        method: 'PATCH',
        body: patch,
        prefer: 'return=representation',
        token: auth.actor === 'admin' ? auth.token : null,
        useServiceRole: auth.actor === 'ai',
      });

      if (!upd.ok) {
        return res.status(upd.status).json({ ok: false, error: upd.data });
      }

      return res.status(200).json({
        ok: true,
        lead: Array.isArray(upd.data) ? upd.data[0] : upd.data,
      });
    }

    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('api/leads error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
