/** 上传表单交互：文件选择/拖放预览 + 大小校验 + 提交。 */

function setStatus(
  el: HTMLElement,
  type: "success" | "error" | "info",
  message: string
): void {
  el.className = `form__status form__status--show form__status--${type}`;
  el.textContent = message;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const uploadTimeoutMs = 120000;

async function readResponseMessage(res: Response, fallback: string): Promise<string> {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (text) {
    try {
      const data = JSON.parse(text) as { message?: unknown };
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
      }
    } catch {
      if (!contentType.includes("text/html")) {
        return text.trim();
      }
    }
  }

  if (!res.ok) {
    return `${fallback}（HTTP ${res.status}）`;
  }
  return fallback;
}

/** 按 input 的 accept（扩展名列表）过滤文件，挡掉拖放绕过类型限制的情况。 */
function filterByAccept(files: File[], accept: string): File[] {
  const exts = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.startsWith("."));
  if (exts.length === 0) return files;
  return files.filter((f) => exts.some((ext) => f.name.toLowerCase().endsWith(ext)));
}

function wireDropzone(
  inputId: string,
  dropId: string,
  listId: string,
  maxBytes: number,
  onError: (msg: string) => void
): void {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  const drop = document.getElementById(dropId);
  const list = document.getElementById(listId);
  if (!input || !drop || !list) return;

  const render = () => {
    list.innerHTML = "";
    const files = input.files ? Array.from(input.files) : [];
    for (const f of files) {
      if (f.size > maxBytes) {
        onError(`文件「${f.name}」超过单文件大小上限（${fmtSize(maxBytes)}）。`);
      }
      const row = document.createElement("div");
      row.className = "dropzone__file";
      const ok = f.size <= maxBytes;
      row.innerHTML = `<span aria-hidden="true">${ok ? "📄" : "⚠️"}</span><span>${f.name}</span><span style="margin-left:auto;color:var(--color-muted)">${fmtSize(f.size)}</span>`;
      list.appendChild(row);
    }
  };

  input.addEventListener("change", render);

  ["dragenter", "dragover"].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("dropzone--drag");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove("dropzone--drag");
    })
  );
  drop.addEventListener("drop", (e) => {
    const dt = (e as DragEvent).dataTransfer;
    if (dt && dt.files.length) {
      const dropped = Array.from(dt.files);
      const accepted = filterByAccept(dropped, input.accept);
      if (accepted.length < dropped.length) {
        onError("部分文件类型不被支持，已忽略。请上传 Word、LaTeX、PDF、图片、模板或压缩包。");
      }
      if (accepted.length) {
        const next = new DataTransfer();
        accepted.forEach((f) => next.items.add(f));
        input.files = next.files;
        render();
      }
    }
  });
}

export function initUploadForm(): void {
  const form = document.getElementById("upload-form") as HTMLFormElement | null;
  if (!form) return;
  const status = document.getElementById("uf-status") as HTMLElement | null;
  if (!status) return;

  const endpoint = form.dataset.endpoint?.trim() || "";
  const mailto = form.dataset.mailto?.trim() || "";
  const successMsg =
    form.dataset.success?.trim() ||
    "上传成功！我们已收到你的稿件，会尽快确认并给出报价。";
  const maxMB = Number(form.dataset.maxMb || "50");
  const maxBytes = maxMB * 1024 * 1024;

  wireDropzone("uf-file-main", "uf-drop-main", "uf-files-main", maxBytes, (m) =>
    setStatus(status, "error", m)
  );
  wireDropzone("uf-file-extra", "uf-drop-extra", "uf-files-extra", maxBytes, (m) =>
    setStatus(status, "error", m)
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid") as HTMLElement | null;
      firstInvalid?.focus();
      setStatus(status, "error", "请检查表单：姓名、邮箱、原始稿件为必填，并需勾选同意隐私政策。");
      return;
    }

    // 文件大小校验
    const allInputs = ["uf-file-main", "uf-file-extra"]
      .map((id) => document.getElementById(id) as HTMLInputElement | null)
      .filter(Boolean) as HTMLInputElement[];
    for (const input of allInputs) {
      for (const f of input.files ? Array.from(input.files) : []) {
        if (f.size > maxBytes) {
          setStatus(status, "error", `文件「${f.name}」超过 ${maxMB}MB 上限，请压缩或拆分后再上传。`);
          return;
        }
      }
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    // 演示模式：未配置上传后端（文件无法通过 mailto 发送）
    if (!endpoint) {
      const contactHint = mailto
        ? `请改用「联系我们」表单提交需求，或将文件发送至 ${mailto}。`
        : "请改用「联系我们」表单提交需求，文件后端接入后即可在线上传。";
      setStatus(
        status,
        "info",
        `文件上传后端尚未接入（演示模式），暂无法在线上传文件。${contactHint}`
      );
      return;
    }

    let timeoutId: number | undefined;
    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus(status, "info", "正在上传，请勿关闭页面…");
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), uploadTimeoutMs);
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
      if (res.ok) {
        const message = await readResponseMessage(res, successMsg);
        form.reset();
        const mainList = document.getElementById("uf-files-main");
        const extraList = document.getElementById("uf-files-extra");
        if (mainList) mainList.innerHTML = "";
        if (extraList) extraList.innerHTML = "";
        setStatus(status, "success", message);
      } else {
        const message = await readResponseMessage(
          res,
          "上传失败，请稍后重试，或通过联系表单 / 邮箱与我们联系。"
        );
        setStatus(status, "error", message);
      }
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "上传或邮件发送超时，请检查 SMTP 网络 / Brevo 配置后重试。"
          : "网络异常，上传未成功。请检查网络后重试。";
      setStatus(status, "error", message);
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
