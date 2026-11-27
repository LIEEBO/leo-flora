-- ============================================================
-- Leo Faux 独立站 CRM & AI 自动跟进系统 — Supabase 数据库升级 SQL
-- 请在 Supabase 控制台 -> SQL Editor 中粘贴并点击 Run 执行（可安全重复执行）
-- ============================================================

-- 1. 扩展 customer_leads 表字段（完全兼容已有历史客户）
ALTER TABLE public.customer_leads
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS product_interest text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS reply_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reply_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_reply_by text,
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'shop';

-- 2. 自动把已有 67 条历史客户的 contact 智能拆分回填到 email / phone 字段
UPDATE public.customer_leads
SET email = trim(contact)
WHERE email IS NULL AND contact IS NOT NULL AND contact LIKE '%@%.%';

UPDATE public.customer_leads
SET phone = trim(contact)
WHERE phone IS NULL AND contact IS NOT NULL AND contact ~ '^[+0-9()\s\-]{7,}$';

-- 3. 创建回复与跟进日志表 lead_replies
CREATE TABLE IF NOT EXISTS public.lead_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.customer_leads(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'email',       -- 'email' | 'ai_email' | 'whatsapp' | 'note'
  direction text NOT NULL DEFAULT 'outbound',  -- 'outbound' | 'inbound'
  sender text NOT NULL DEFAULT 'admin',        -- 'admin' | 'ai' | 'customer'
  subject text,
  content text NOT NULL,
  delivery_status text NOT NULL DEFAULT 'sent', -- 'sent' | 'logged' | 'failed'
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_replies_lead_id ON public.lead_replies(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_leads_status ON public.customer_leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_leads_email ON public.customer_leads(lower(email));

-- 4. 开启 RLS 并为管理员登录（authenticated）授权读写
ALTER TABLE public.lead_replies ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lead_replies' AND policyname = 'admin_all_lead_replies'
  ) THEN
    CREATE POLICY admin_all_lead_replies
      ON public.lead_replies
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customer_leads' AND policyname = 'admin_update_customer_leads'
  ) THEN
    CREATE POLICY admin_update_customer_leads
      ON public.customer_leads
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
