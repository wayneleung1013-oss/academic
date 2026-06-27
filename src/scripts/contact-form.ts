/** 联系表单交互：前端校验 + 提交（支持已配置后端 / 演示模式）。 */

function setStatus(
  el: HTMLElement,
  type: "success" | "error" | "info",
  message: string
): void {
  el.className = `form__status form__status--show form__status--${type}`;
  el.textContent = message;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export function initContactForm(): void {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  if (!form) return;
  const status = document.getElementById("cf-status") as HTMLElement | null;
  if (!status) return;

  const endpoint = form.dataset.endpoint?.trim() || "";
  const mailto = form.dataset.mailto?.trim() || "";
  const successMsg =
    form.dataset.success?.trim() ||
    "提交成功！我们会尽快通过邮箱或微信 / WhatsApp 与你联系并给出报价。";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 原生校验
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid") as HTMLElement | null;
      firstInvalid?.focus();
      setStatus(status, "error", "请检查表单：带 * 的为必填项，邮箱需格式正确，并需勾选同意隐私政策。");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const data = new FormData(form);

    // 演示模式：未配置后端
    if (!endpoint) {
      const name = String(data.get("name") || "");
      if (mailto) {
        const subject = encodeURIComponent(`排版需求 - ${name}`);
        const lines: string[] = [];
        data.forEach((v, k) => {
          if (k !== "consent" && String(v).trim()) lines.push(`${k}: ${v}`);
        });
        const body = encodeURIComponent(lines.join("\n"));
        setStatus(
          status,
          "info",
          "网站表单后端尚未接入。已为你准备邮件草稿，请在弹出的邮件中确认并发送。"
        );
        window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
      } else {
        setStatus(
          status,
          "info",
          "表单后端尚未接入（演示模式）。请在 src/config/site.ts 配置 forms.contactEndpoint 或联系邮箱后即可正常收件。"
        );
      }
      return;
    }

    // 已配置后端：提交
    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus(status, "info", "正在提交…");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        form.reset();
        setStatus(status, "success", successMsg);
      } else {
        setStatus(status, "error", "提交失败，请稍后重试，或直接通过邮箱 / 微信联系我们。");
      }
    } catch {
      setStatus(status, "error", "网络异常，提交未成功。请检查网络后重试，或直接联系我们。");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
