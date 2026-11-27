const dns = require('dns').promises;

// 常见一次性/临时垃圾邮箱域名黑名单
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.org', 'guerrillamail.net',
  'sharklasers.com', 'grr.la', '10minutemail.com', '10minutemail.net',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'yopmail.com', 'yopmail.fr',
  'trashmail.com', 'trashmail.net', 'dispostable.com', 'maildrop.cc',
  'getnada.com', 'nada.email', 'fakeinbox.com', 'mintemail.com',
  'throwawaymail.com', 'mohmal.com', 'emailondeck.com', 'burnermail.io',
  'mailnesia.com', 'mytemp.email', 'tempr.email', 'dropmail.me',
  'example.com', 'example.org', 'example.net', 'test.com', 'test.org',
  'invalid.com', 'none.com', 'noemail.com', 'fake.com', 'asdf.com'
]);

const FAKE_LOCAL_PARTS = new Set([
  'test', 'testing', '123', '1234', '12345', '123456', 'aaa', 'aaaa',
  'asdf', 'qwer', 'qwerty', 'fake', 'none', 'null', 'admin', 'abc', 'abcd'
]);

function validateName(rawName) {
  const name = String(rawName || '').trim();
  if (name.length < 2) {
    return { ok: false, error: 'Please enter a valid name or company name (at least 2 characters).' };
  }
  if (/^[0-9\W_]+$/.test(name)) {
    return { ok: false, error: 'Name cannot be only numbers or symbols.' };
  }
  if (/^(.)\1{2,}$/.test(name.replace(/\s+/g, ''))) {
    return { ok: false, error: 'Please enter your real name or company name.' };
  }
  return { ok: true, value: name };
}

async function validateEmailStrict(rawEmail) {
  const email = String(rawEmail || '').trim().toLowerCase();
  if (!email) {
    return { ok: false, error: 'Please enter your business or personal email address.' };
  }
  const emailRegex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
  if (!emailRegex.test(email) || email.length > 180) {
    return { ok: false, error: 'Invalid email format. Example: buyer@company.com' };
  }

  const parts = email.split('@');
  const local = parts[0];
  const domain = parts[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, error: 'Temporary or disposable email addresses are not accepted. Please use a real email.' };
  }
  if (FAKE_LOCAL_PARTS.has(local) && (domain === 'gmail.com' || domain === 'qq.com' || domain === '163.com' || domain === 'yahoo.com')) {
    return { ok: false, error: 'Please enter your real email address so we can send you the wholesale catalog.' };
  }

  // 实时 DNS MX 记录校验：明确不存在/无邮件记录的域名直接拦截；DNS 偶发超时则放行避免误杀真实客户
  try {
    const mx = await withTimeout(dns.resolveMx(domain), 3500);
    if (Array.isArray(mx) && mx.length > 0) {
      return { ok: true, value: email };
    }
  } catch (mxErr) {
    const code = mxErr && mxErr.code ? mxErr.code : mxErr.message;
    if (code === 'DNS_TIMEOUT' || code === 'ETIMEOUT' || code === 'EAI_AGAIN' || code === 'ESERVFAIL') {
      return { ok: true, value: email };
    }
    // 某些企业域名未单独设 MX，直接用 A 记录收信，兜底查一次 resolve4
    try {
      const a = await withTimeout(dns.resolve4(domain), 2500);
      if (Array.isArray(a) && a.length > 0) {
        return { ok: true, value: email };
      }
    } catch (aErr) {
      const aCode = aErr && aErr.code ? aErr.code : aErr.message;
      if (aCode === 'DNS_TIMEOUT' || aCode === 'ETIMEOUT' || aCode === 'EAI_AGAIN' || aCode === 'ESERVFAIL') {
        return { ok: true, value: email };
      }
      return {
        ok: false,
        error: `Email domain "${domain}" cannot receive emails. Please check for typos.`,
      };
    }
  }

  return {
    ok: false,
    error: `Email domain "${domain}" has no valid mail server. Please check for typos.`,
  };
}

function validatePhoneStrict(rawPhone) {
  const input = String(rawPhone || '').trim();
  if (!input) {
    return { ok: false, error: 'Please enter a valid phone / WhatsApp number with country code (e.g. +1 323 963 6250).' };
  }

  // 仅允许数字、空格、+、-、()
  if (/[^0-9+\-\s().]/.test(input)) {
    return { ok: false, error: 'Phone / WhatsApp number can only contain digits and country code (e.g. +44 7911 123456).' };
  }

  const digits = input.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) {
    return { ok: false, error: 'Phone / WhatsApp number must be 8–15 digits including country code.' };
  }

  // 拦截全相同数字（如 1111111111, 00000000）
  if (/^(\d)\1+$/.test(digits)) {
    return { ok: false, error: 'Please enter a real phone / WhatsApp number.' };
  }

  // 拦截连续递增/递减假号（如 123456789, 987654321）
  const seqAsc = '01234567890123456789';
  const seqDesc = '98765432109876543210';
  const tail = digits.length > 7 ? digits.slice(-7) : digits;
  if (seqAsc.includes(tail) || seqDesc.includes(tail)) {
    return { ok: false, error: 'Please enter a real phone / WhatsApp number.' };
  }

  // 拦截过度重复模式（例如超过 70% 是同一个数字，如 1000000001）
  const freq = {};
  let maxCount = 0;
  for (const ch of digits) {
    freq[ch] = (freq[ch] || 0) + 1;
    if (freq[ch] > maxCount) maxCount = freq[ch];
  }
  if (maxCount / digits.length >= 0.75) {
    return { ok: false, error: 'Please enter a valid reachable phone / WhatsApp number.' };
  }

  const normalized = input.startsWith('+') ? `+${digits}` : `+${digits}`;
  return { ok: true, value: normalized };
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('DNS_TIMEOUT')), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

module.exports = {
  validateName,
  validateEmailStrict,
  validatePhoneStrict,
};
