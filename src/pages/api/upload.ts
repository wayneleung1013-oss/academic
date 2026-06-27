import "dotenv/config";
import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { site } from "../../config/site";

export const prerender = false;

type UploadedFile = {
  field: "manuscript" | "materials";
  file: File;
};

type DetailRow = {
  label: string;
  value: string;
};

type MailContent = {
  text: string;
  html: string;
};

type SmtpError = Error & {
  code?: string;
  response?: string;
  responseCode?: number;
  command?: string;
};

type ResendError = Error & {
  status?: number;
  response?: string;
};

type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

type MailOptions = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  attachments?: MailAttachment[];
};

const fieldLabels: Record<string, string> = {
  name: "姓名",
  email: "邮箱",
  wechat_whatsapp: "微信 / WhatsApp",
  manuscript_type: "稿件类型",
  target_journal: "目标期刊 / 会议名称",
  target_url: "目标期刊 / 会议链接",
  need_blinded: "是否需要匿名稿",
  need_titlepage: "是否需要标题页",
  need_xml: "是否需要 JATS XML",
  rush: "是否加急",
  deadline: "期望交付时间",
  notes: "特殊说明",
  consent: "隐私政策同意",
};

const textFields = Object.keys(fieldLabels);

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function parseBoolean(value: string, fallback: boolean): boolean {
  if (!value) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isProbablyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/[\r\n]/.test(value);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function collectFiles(formData: FormData): UploadedFile[] {
  const files: UploadedFile[] = [];
  for (const field of ["manuscript", "materials"] as const) {
    for (const value of formData.getAll(field)) {
      if (value instanceof File && value.size > 0) {
        files.push({ field, file: value });
      }
    }
  }
  return files;
}

async function makeAttachments(files: UploadedFile[]): Promise<MailAttachment[]> {
  return Promise.all(
    files.map(async ({ field, file }) => ({
      filename: file.name || `${field}-file`,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || "application/octet-stream",
    }))
  );
}

function formatSubmittedAt(date: Date): string {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function collectRows(formData: FormData, files: UploadedFile[], submittedAtText: string) {
  const fieldRows = textFields.map((key) => {
    const value = getFormText(formData, key);
    return {
      label: fieldLabels[key],
      value: value || "未填写",
    };
  });

  const fileRows = files.map(({ field, file }) => ({
    label: field === "manuscript" ? "原始稿件" : "其他材料",
    value: `${file.name || "未命名文件"} (${formatBytes(file.size)})`,
  }));

  const metaRows = [{ label: "提交时间", value: submittedAtText }];

  return { fieldRows, fileRows, allRows: [...metaRows, ...fieldRows, ...fileRows] };
}

function renderRows(rows: DetailRow[]): string {
  return rows
    .map(
      (r) => `
        <tr>
          <th style="width:190px;text-align:left;vertical-align:top;padding:11px 14px;border-bottom:1px solid #e7edf6;background:#f7faff;color:#365174;font-size:13px;font-weight:700;">
            ${escapeHtml(r.label)}
          </th>
          <td style="padding:11px 14px;border-bottom:1px solid #e7edf6;color:#13243a;font-size:14px;">
            ${escapeHtml(r.value).replace(/\n/g, "<br>")}
          </td>
        </tr>`
    )
    .join("");
}

function renderEmailShell(options: {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  bodyHtml: string;
  footer?: string;
}): string {
  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(options.preheader)}
    </div>
    <div style="margin:0;padding:0;background:#f3f7fc;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f3f7fc;">
        <tr>
          <td align="center" style="padding:28px 14px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;max-width:760px;background:#ffffff;border:1px solid #d9e4f2;border-radius:8px;overflow:hidden;box-shadow:0 16px 40px rgba(24,54,92,0.10);">
              <tr>
                <td style="padding:26px 30px;background:#0f3f84;color:#ffffff;">
                  <div style="font-size:12px;line-height:1.4;letter-spacing:0;text-transform:uppercase;color:#bfd6ff;font-weight:700;">
                    ${escapeHtml(options.eyebrow)}
                  </div>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;line-height:1.3;font-weight:750;">
                    ${escapeHtml(options.title)}
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding:26px 30px 8px;color:#263a56;font-size:15px;line-height:1.7;">
                  ${escapeHtml(options.intro).replace(/\n/g, "<br>")}
                </td>
              </tr>
              <tr>
                <td style="padding:16px 30px 30px;">
                  ${options.bodyHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:18px 30px;background:#f7faff;border-top:1px solid #e4ebf5;color:#60718a;font-size:12px;line-height:1.6;">
                  ${escapeHtml(options.footer ?? `${site.brand} · ${site.url}`)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildAdminMessage(formData: FormData, files: UploadedFile[], submittedAtText: string): MailContent {
  const { allRows } = collectRows(formData, files, submittedAtText);
  const lines = [
    "ScholarFormat Studio 上传文件并获取报价",
    "",
    ...allRows.map((r) => `${r.label}: ${r.value}`),
  ];

  return {
    text: lines.join("\n"),
    html: renderEmailShell({
      preheader: "有新的稿件报价请求，请查看表单信息和附件。",
      eyebrow: site.brand,
      title: "新的稿件报价请求",
      intro: "网站上传表单收到新的稿件和报价需求。附件已随本邮件发送，请根据下方信息确认服务范围、报价和交付时间。",
      bodyHtml: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e0e8f3;border-radius:8px;overflow:hidden;">
          ${renderRows(allRows)}
        </table>
      `,
      footer: "此邮件由网站上传接口自动发送。回复本邮件将回复给用户填写的邮箱。",
    }),
  };
}

function buildReceiptMessage(
  formData: FormData,
  files: UploadedFile[],
  submittedAtText: string
): MailContent {
  const name = getFormText(formData, "name") || "您好";
  const { fieldRows, fileRows } = collectRows(formData, files, submittedAtText);
  const summaryKeys = new Set([
    "manuscript_type",
    "target_journal",
    "need_xml",
    "rush",
    "deadline",
    "notes",
  ]);
  const summaryRows: DetailRow[] = [
    { label: "提交时间", value: submittedAtText },
    ...fieldRows.filter((row) =>
      Object.entries(fieldLabels).some(
        ([key, label]) => label === row.label && summaryKeys.has(key)
      )
    ),
    ...fileRows,
  ];

  const lines = [
    `${name}，您好：`,
    "",
    "我们已收到您提交的稿件和报价需求。",
    "团队会查看文件、目标期刊 / 会议要求和交付时间，并尽快通过邮件与您确认服务范围、报价和预计交付时间。",
    "",
    "提交摘要:",
    ...summaryRows.map((r) => `${r.label}: ${r.value}`),
    "",
    `如需补充材料，可直接回复本邮件。`,
    site.brand,
  ];

  return {
    text: lines.join("\n"),
    html: renderEmailShell({
      preheader: "我们已收到您提交的稿件和报价需求。",
      eyebrow: site.brand,
      title: "我们已收到您的稿件",
      intro: `${name}，您好：\n我们已收到您提交的稿件和报价需求。团队会查看文件、目标期刊 / 会议要求和交付时间，并尽快通过邮件与您确认服务范围、报价和预计交付时间。`,
      bodyHtml: `
        <div style="margin:0 0 16px;padding:15px 16px;border:1px solid #cfe0f7;background:#f7fbff;border-radius:8px;color:#244261;font-size:14px;line-height:1.7;">
          您无需重复提交。若需要补充材料或说明，可直接回复本邮件。
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e0e8f3;border-radius:8px;overflow:hidden;">
          ${renderRows(summaryRows)}
        </table>
        <div style="margin-top:18px;">
          <a href="${escapeHtml(site.url)}" style="display:inline-block;background:#1f66d1;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:11px 16px;border-radius:6px;">
            访问 ${escapeHtml(site.brand)}
          </a>
        </div>
      `,
      footer: `${site.brand} · 如需补充材料，请直接回复本邮件。`,
    }),
  };
}

function getSmtpFailureMessage(error: unknown, fallback: string): string {
  const smtpError = error as Partial<SmtpError>;
  const message = error instanceof Error ? error.message : "";
  const response = smtpError.response ?? "";
  const code = smtpError.code ?? "";
  const responseCode = smtpError.responseCode;
  const detail = `${message} ${response} ${code}`.trim();

  if (code === "EAUTH" || responseCode === 535 || /authentication failed|invalid login/i.test(detail)) {
    return "SMTP 认证失败：请确认 SMTP_USER 和 SMTP_PASS 使用当前邮件服务商的 SMTP 凭据。Resend 请填 SMTP_USER=resend，SMTP_PASS 填 Resend API key。";
  }

  if (/not yet activated|request activation|smtp account is not/i.test(detail)) {
    return "SMTP 发信账号尚未激活：当前账号已能登录 SMTP，但邮件服务商在发信阶段拒绝发送。请在服务商后台开通事务邮件 / SMTP 发信权限，或联系支持申请激活。";
  }

  if (/socket close|connection closed|ECONNRESET|ETIMEDOUT/i.test(detail)) {
    return "SMTP 连接被关闭：当前本机仍可能在使用代理 Fake-IP DNS / TUN，或网络阻断 SMTP 端口。请恢复真实 DNS 后重试，或在 .env 配置可用的 SMTP_PROXY。";
  }

  if (/ENOTFOUND|EAI_AGAIN|DNS/i.test(detail)) {
    return "SMTP 域名解析失败：请检查网络 DNS，确认 SMTP_HOST 能解析到真实公网地址，而不是 198.18.x.x Fake-IP；也可以在 .env 配置 SMTP_HOST_IP 临时绕过本机 DNS。";
  }

  if (
    responseCode === 550 ||
    responseCode === 553 ||
    /sender|from|mail from|not verified|not allowed|rejected/i.test(detail)
  ) {
    return "SMTP 发件人被拒绝：请确认 SMTP_FROM 使用邮件服务商后台已验证的发件人邮箱，例如 ScholarFormat Studio <sfs@scholarformatstudio.com>。";
  }

  return fallback;
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

  if (status === 413 || /attachment|too large|payload/i.test(detail)) {
    return "Resend 拒绝发送：附件或请求体过大，请压缩文件后重试。";
  }

  return fallback;
}

async function sendWithResend(apiKey: string, options: MailOptions): Promise<void> {
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
      attachments: options.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content.toString("base64"),
        content_type: attachment.contentType,
      })),
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

  const mailProvider = env("MAIL_PROVIDER").toLowerCase();
  const useResendApi = mailProvider === "resend" || Boolean(env("RESEND_API_KEY"));
  const resendApiKey = env("RESEND_API_KEY") || (useResendApi ? env("SMTP_PASS") : "");
  const smtpHost = env("SMTP_HOST");
  const smtpHostIp = env("SMTP_HOST_IP");
  const smtpPort = Number(env("SMTP_PORT") || "587");
  const smtpUser = env("SMTP_USER");
  const smtpPass = env("SMTP_PASS");
  const mailFrom = env("SMTP_FROM") || smtpUser;
  const notifyTo = env("UPLOAD_NOTIFY_TO") || env("MAIL_TO") || site.contact.email;
  const secure = parseBoolean(env("SMTP_SECURE"), smtpPort === 465);
  const proxy = env("SMTP_PROXY");

  if (useResendApi) {
    if (!resendApiKey || !mailFrom || !notifyTo) {
      return json(500, {
        ok: false,
        message: "Resend API 未配置完整，请设置 MAIL_PROVIDER=resend、SMTP_FROM、UPLOAD_NOTIFY_TO，并设置 RESEND_API_KEY 或 SMTP_PASS。",
      });
    }
  } else if (!smtpHost || !mailFrom || !notifyTo) {
    return json(500, {
      ok: false,
      message: "SMTP 未配置完整，请设置 SMTP_HOST、SMTP_FROM/SMTP_USER、UPLOAD_NOTIFY_TO。",
    });
  }

  if (!useResendApi && ((smtpUser && !smtpPass) || (!smtpUser && smtpPass))) {
    return json(500, { ok: false, message: "SMTP_USER 和 SMTP_PASS 需要同时配置。" });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json(400, { ok: false, message: "无法读取上传内容。" });
  }

  const name = getFormText(formData, "name");
  const email = getFormText(formData, "email");
  const files = collectFiles(formData);

  if (!name || !email || files.filter((f) => f.field === "manuscript").length === 0) {
    return json(400, { ok: false, message: "姓名、邮箱和原始稿件为必填。" });
  }

  if (!isProbablyEmail(email)) {
    return json(400, { ok: false, message: "邮箱格式不正确，请检查后重新提交。" });
  }

  const maxFileBytes = site.forms.maxUploadMB * 1024 * 1024;
  const oversized = files.find((item) => item.file.size > maxFileBytes);
  if (oversized) {
    return json(413, {
      ok: false,
      message: `文件「${oversized.file.name}」超过 ${site.forms.maxUploadMB}MB 上限。`,
    });
  }

  let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;
  if (!useResendApi) {
    const smtpOptions: SMTPTransport.Options & { proxy?: string } = {
      host: smtpHostIp || smtpHost,
      port: smtpPort,
      secure,
      auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
      proxy: proxy || undefined,
      tls: smtpHostIp ? { servername: smtpHost } : undefined,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
    };
    transporter = nodemailer.createTransport(smtpOptions);
  }

  const submittedAtText = formatSubmittedAt(new Date());
  const adminMessage = buildAdminMessage(formData, files, submittedAtText);
  const receiptMessage = buildReceiptMessage(formData, files, submittedAtText);
  const safeName = cleanHeaderValue(name);
  const attachments = await makeAttachments(files);

  try {
    const adminMail: MailOptions = {
      from: mailFrom,
      to: notifyTo,
      replyTo: email,
      subject: `新的稿件报价请求 - ${safeName}`,
      text: adminMessage.text,
      html: adminMessage.html,
      attachments,
    };

    if (useResendApi) {
      await sendWithResend(resendApiKey, adminMail);
    } else {
      if (!transporter) throw new Error("SMTP transport is not initialized.");
      await transporter.sendMail(adminMail);
    }
  } catch (error) {
    console.error("Upload email failed:", error);
    return json(502, {
      ok: false,
      message: useResendApi
        ? getResendFailureMessage(error, "邮件发送失败，请检查 Resend API 配置。")
        : getSmtpFailureMessage(error, "邮件发送失败，请检查 SMTP 配置。"),
    });
  }

  try {
    const receiptMail: MailOptions = {
      from: mailFrom,
      to: email,
      replyTo: notifyTo,
      subject: `${site.brand} 已收到您的稿件`,
      text: receiptMessage.text,
      html: receiptMessage.html,
    };

    if (useResendApi) {
      await sendWithResend(resendApiKey, receiptMail);
    } else {
      if (!transporter) throw new Error("SMTP transport is not initialized.");
      await transporter.sendMail(receiptMail);
    }
  } catch (error) {
    console.error("Upload receipt email failed:", error);
    return json(502, {
      ok: false,
      message: useResendApi
        ? getResendFailureMessage(
            error,
            "稿件通知已发送，但用户确认邮件发送失败，请检查用户邮箱或 Resend 发信限制。"
          )
        : getSmtpFailureMessage(
            error,
            "稿件通知已发送，但用户确认邮件发送失败，请检查用户邮箱或 SMTP 发信限制。"
          ),
    });
  }

  return json(200, { ok: true, message: "文件已提交，我们也已向您填写的邮箱发送确认邮件。" });
};
