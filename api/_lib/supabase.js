const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pdenhgnxrgngwvqtrmhk.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZW5oZ254cmduZ3d2cXRybWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNDUwODUsImV4cCI6MjA5NzYyMTA4NX0.RUPqVRCE-sLsFJT64SuiWhtLvC_bho3Po4dTDlnKrgI';

function getServiceKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

async function supabaseRest(path, options = {}) {
  const { method = 'GET', body, token, prefer, useServiceRole = true } = options;
  const serviceKey = getServiceKey();
  const apiKey = useServiceRole && serviceKey ? serviceKey : SUPABASE_ANON_KEY;
  const authHeader = token ? `Bearer ${token}` : `Bearer ${apiKey}`;

  const headers = {
    apikey: apiKey,
    Authorization: authHeader,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { ok: res.ok, status: res.status, data };
}

/**
 * 统一鉴权：
 * 1) 外部 AI 系统通过 Header `x-api-key` 认证（匹配 Vercel 环境变量 AI_API_KEY）
 * 2) 网页后台管理员通过 Header `Authorization: Bearer <supabase_access_token>` 认证
 */
async function authenticateRequest(req) {
  const apiKeyHeader = (req.headers['x-api-key'] || '').trim();
  const configuredAiKey = (process.env.AI_API_KEY || '').trim();

  if (apiKeyHeader && configuredAiKey && apiKeyHeader === configuredAiKey) {
    return { authorized: true, actor: 'ai', token: null };
  }

  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      if (userRes.ok) {
        const user = await userRes.json();
        return { authorized: true, actor: 'admin', email: user.email || '', token };
      }
    }
  }

  return { authorized: false, actor: null, token: null };
}

function setCors(res, methods = 'GET,POST,PATCH,OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Cache-Control', 'no-store');
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

module.exports = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  getServiceKey,
  supabaseRest,
  authenticateRequest,
  setCors,
  parseBody,
};
