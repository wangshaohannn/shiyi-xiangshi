const SITE_URL_ENV_KEYS = [
  "SITE_URL",
  "VITE_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
  "RENDER_EXTERNAL_URL",
];

const PLACEHOLDER_HOSTS = new Set([
  "your-domain.com",
  "www.your-domain.com",
  "example.com",
  "www.example.com",
  "你的正式域名",
]);

const PLACEHOLDER_VALUE_PATTERNS = [/your[-_]/i, /change[-_]this/i, /example/i, /你的/, /占位/];

function clean(value) {
  return String(value || "").trim();
}

function hasPlaceholderValue(value) {
  const raw = clean(value);
  return !raw || PLACEHOLDER_VALUE_PATTERNS.some((pattern) => pattern.test(raw));
}

export function normalizeSiteUrl(value) {
  const raw = clean(value);
  if (!raw) return "";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

export function resolveSiteUrl(env = process.env) {
  for (const key of SITE_URL_ENV_KEYS) {
    const raw = clean(env[key]);
    if (!raw) continue;

    const url = normalizeSiteUrl(raw);
    const hostname = url ? new URL(url).hostname : "";
    return {
      envKey: key,
      raw,
      url,
      isPlaceholder: !url || PLACEHOLDER_HOSTS.has(hostname) || hasPlaceholderValue(raw),
    };
  }

  return { envKey: "", raw: "", url: "", isPlaceholder: false };
}

export function requireSiteUrl(env = process.env) {
  const site = resolveSiteUrl(env);
  if (!site.raw) {
    throw new Error(`缺少 SITE_URL。请设置正式域名，例如 SITE_URL=https://www.shiyixiangshi.com`);
  }
  if (!site.url) {
    throw new Error(`${site.envKey} 不是有效 URL：${site.raw}`);
  }
  if (site.isPlaceholder) {
    throw new Error(`${site.envKey} 仍是占位值：${site.raw}。请改成正式域名后再构建/上线。`);
  }
  return site.url;
}

export function fallbackSiteUrl(env = process.env, fallback = "http://127.0.0.1:5173") {
  const site = resolveSiteUrl(env);
  return site.url && !site.isPlaceholder ? site.url : fallback;
}

export function validateRuntimeEnv(env = process.env) {
  const errors = [];
  const isProduction = env.NODE_ENV === "production";
  const site = resolveSiteUrl(env);
  const supabaseUrl = clean(env.SUPABASE_URL);
  const supabaseKey = clean(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY);
  const supabaseTable = clean(env.SUPABASE_STATE_TABLE || "site_state");
  const adminToken = clean(env.ADMIN_TOKEN);
  const requiresSupabase = clean(env.REQUIRE_SUPABASE).toLowerCase() === "true";

  if (isProduction) {
    if (!site.raw) {
      errors.push("生产环境缺少 SITE_URL。");
    } else if (!site.url) {
      errors.push(`${site.envKey} 不是有效 URL：${site.raw}`);
    } else if (site.isPlaceholder) {
      errors.push(`${site.envKey} 仍是占位值：${site.raw}`);
    }

    if (!adminToken) {
      errors.push("生产环境缺少 ADMIN_TOKEN。");
    } else if (hasPlaceholderValue(adminToken)) {
      errors.push("ADMIN_TOKEN 仍是占位值，请改成不可猜测的后台口令。");
    }
  } else if (site.raw && (!site.url || site.isPlaceholder)) {
    errors.push(`${site.envKey} 不是可上线的正式 URL：${site.raw}`);
  }

  if (requiresSupabase || supabaseUrl || supabaseKey) {
    if (!supabaseUrl) errors.push("缺少 SUPABASE_URL。");
    if (!supabaseKey) errors.push("缺少 SUPABASE_SERVICE_ROLE_KEY。");
    if (supabaseUrl && (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl) || hasPlaceholderValue(supabaseUrl))) {
      errors.push("SUPABASE_URL 必须是当前项目的 https://<project>.supabase.co 地址。");
    }
    if (supabaseKey && hasPlaceholderValue(supabaseKey)) {
      errors.push("SUPABASE_SERVICE_ROLE_KEY 仍是占位值。");
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(supabaseTable)) {
      errors.push("SUPABASE_STATE_TABLE 只能包含字母、数字和下划线，且不能以数字开头。");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertRuntimeEnv(env = process.env) {
  const result = validateRuntimeEnv(env);
  if (!result.ok) {
    throw new Error(`环境变量校验失败：\n- ${result.errors.join("\n- ")}`);
  }
}
