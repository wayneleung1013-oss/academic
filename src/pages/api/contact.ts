import "dotenv/config";
import type { APIRoute } from "astro";
import { site } from "../../config/site";

export const prerender = false;

type ResendError = Error & {
  status?: number;
  response?: string;
};

const fieldLabels: Record<string, string> = {
  name: "姓名",
  email: "邮箱",
  wechat_whatsapp: "微信 / WhatsApp",
  customer_type: "客户类型",
  services: "需要的服务",
  target_journal: "目标期刊 / 会议名称",
  guidelines_url: "目标期刊 author guidelines 链接",
  word_count: "稿件字数",
  figure_count: "图表数量",
  reference_count: "参考文献数量",
  deadline: "期望交付时间",
  need_latex: "是否需要 LaTeX",
  need_xml: "是否需要 XML",
  notes: "备注说明",
};

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function cleanHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isProbablyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n]/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFormText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function collectRows(formData: FormData): { label: string; value: string }[] {
  return Object.entries(fieldLabels)
    .map(([key, label]) => {
      const values = formData
        .getAll(key)
        .map((value) => String(value).trim())
        .filter(Boolean);
      return { label, value: values.join("、") };
    })
    .filter((row) => row.value);
}

function renderRows(rows: { label: string; value: string }[]): string {
  return rows
    .map(
      (row) => `
        <tr>
          <th style="text-align:left;vertical-align:top;width:34%;padding:10px 12px;border-bottom:1px solid #e0e8f3;background:#f7fbff;color:#244261;font-size:13px;">
            ${escapeHtml(row.label)}
          </th>
          <td style="padding:10px 12px;border-bottom:1px solid #e0e8f3;color:#1d2b3a;font-size:13px;line-height:1.6;">
            ${escapeHtml(row.value).replace(/\n/g, "<br />")}
          </td>
        </tr>
      `
    )
    .join("");
}

function renderEmailShell(title: string, intro: string, rows: { label: string; value: string }[]): string {
  return `
    <div style="margin:0;padding:24px;background:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe5f2;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:22px 24px;background:#1b4a87;color:#ffffff;">
            <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.78;">${escapeHtml(site.brand)}</div>
            <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;">${escapeHtml(title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 24px;">
            <p style="margin:0 0 16px;color:#33485f;font-size:14px;line-height:1.7;">${escapeHtml(intro)}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e0e8f3;border-radius:8px;overflow:hidden;">
              ${renderRows(rows)}
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function getResendFailureMessage(error: unknown, fallback: string): string {
  const resendError = error as Partial<ResendError>;
  const message = error instanceof Error ? error.message : "";
  const response = resendError.response ?? "";
  const status = resendError.status;
  const detail = `${message} ${response}`.trim();

  if (status === 401 || /invalid.*api.*key|unauthorized/i.test(detail)) {
    return "Resend API 认证失败：请确认 RESEND_API_KEY 或 SMTP_PASS 使用有效的 Resend API key。";
  }

  if (status === 403 || /domain|sender|from|verified|permission/i.test(detail)) {
    return "Resend 发件人被拒绝：请确认 SMTP_FROM 使用 Resend 后台已验证的发件域名或邮箱。";
  }

  return fallback;
}

async function sendWithResend(apiKey: string, options: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: options.from,
      to: [options.to],
      reply_to: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Resend API ${response.status}: ${body.slice(0, 500)}`) as ResendError;
    error.status = response.status;
    error.response = body;
    throw error;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return json(415, { ok: false, message: "请求格式错误。" });
  }

  const apiKey = env("RESEND_API_KEY") || env("SMTP_PASS");
  const mailFrom = env("SMTP_FROM") || site.contact.email;
  const notifyTo = env("CONTACT_NOTIFY_TO") || env("UPLOAD_NOTIFY_TO") || site.contact.email;

  if (!apiKey || !mailFrom || !notifyTo) {
    return json(500, {
      ok: false,
      message: "联系表单邮件未配置完整，请设置 SMTP_FROM、UPLOAD_NOTIFY_TO，并设置 RESEND_API_KEY 或 SMTP_PASS。",
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json(400, { ok: false, message: "无法读取提交内容。" });
  }

  const name = getFormText(formData, "name");
  const email = getFormText(formData, "email");

  if (!name || !email) {
    return json(400, { ok: false, message: "姓名和邮箱为必填。" });
  }

  if (!isProbablyEmail(email)) {
    return json(400, { ok: false, message: "邮箱格式不正确，请检查后重新提交。" });
  }

  const rows = collectRows(formData);
  const text = [
    "ScholarFormat Studio 联系表单",
    "",
    ...rows.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");
  const safeName = cleanHeaderValue(name);

  try {
    await sendWithResend(apiKey, {
      from: mailFrom,
      to: notifyTo,
      replyTo: email,
      subject: `新的排版需求 - ${safeName}`,
      text,
      html: renderEmailShell(
        "新的排版需求",
        "网站联系表单收到新的排版需求，请根据下方信息确认服务范围、报价和交付时间。",
        rows
      ),
    });
  } catch (error) {
    console.error("Contact email failed:", error);
    return json(502, {
      ok: false,
      message: getResendFailureMessage(error, "邮件发送失败，请检查 Resend API 配置。"),
    });
  }

  return json(200, {
    ok: true,
    message: "感谢提交，我们会根据您提供的信息评估稿件复杂度，并尽快回复报价。",
  });
};
