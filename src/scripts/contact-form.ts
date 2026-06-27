/** 联系表单交互：前端校验 + 提交。 */

import { localized } from "./language-switch";

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
    localized(
      "提交成功！我们会尽快通过邮箱或微信 / WhatsApp 与你联系并给出报价。",
      "Submitted. We will review your details and reply with a quote soon."
    );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 原生校验
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid") as HTMLElement | null;
      firstInvalid?.focus();
      setStatus(
        status,
        "error",
        localized(
          "请检查表单：带 * 的为必填项，邮箱需格式正确，并需勾选同意隐私政策。",
          "Please check the form: required fields must be filled, the email must be valid, and privacy consent must be checked."
        )
      );
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const data = new FormData(form);

    // 未配置后端时降级到邮件草稿，避免用户输入丢失。
    if (!endpoint) {
      const name = String(data.get("name") || "");
      if (mailto) {
        const subject = encodeURIComponent(
          localized(`排版需求 - ${name}`, `Formatting request - ${name}`)
        );
        const lines: string[] = [];
        data.forEach((v, k) => {
          if (k !== "consent" && String(v).trim()) lines.push(`${k}: ${v}`);
        });
        const body = encodeURIComponent(lines.join("\n"));
        setStatus(
          status,
          "info",
          localized(
            "暂时无法直接提交。已为你准备邮件草稿，请在弹出的邮件中确认并发送。",
            "Direct submission is temporarily unavailable. An email draft has been prepared; please review and send it."
          )
        );
        window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
      } else {
        setStatus(
          status,
          "info",
          localized(
            "暂时无法直接提交，请稍后重试。",
            "Direct submission is temporarily unavailable. Please try again later."
          )
        );
      }
      return;
    }

    // 已配置后端：提交
    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus(status, "info", localized("正在提交…", "Submitting..."));
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        form.reset();
        setStatus(
          status,
          "success",
          localized(successMsg, "Submitted. We will review your details and reply with a quote soon.")
        );
      } else {
        setStatus(
          status,
          "error",
          localized(
            "提交失败，请稍后重试，或直接通过邮箱联系我们。",
            "Submission failed. Please try again later or contact us by email."
          )
        );
      }
    } catch {
      setStatus(
        status,
        "error",
        localized(
          "网络异常，提交未成功。请检查网络后重试，或直接联系我们。",
          "Network error. Please check your connection and try again, or contact us directly."
        )
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
