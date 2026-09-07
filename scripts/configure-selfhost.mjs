// One-time, loopback-only credential entry. Never log submitted fields.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const destination = fileURLToPath(new URL("../.env.selfhost", import.meta.url));
if (existsSync(destination)) {
  console.error(
    "Deployment configuration already exists; it has not been changed.",
  );
  process.exit(1);
}
const route = `/setup/${randomBytes(24).toString("hex")}`;
let origin;
let saved = false;
const page = `<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Signal House Media — private setup</title>
<style>body{font:16px system-ui;background:#f3f5f7;color:#17232c;margin:0;padding:32px}
main{max-width:520px;margin:32px auto;background:white;padding:32px;border-radius:16px}
label{display:block;margin-top:20px;font-weight:600}input{box-sizing:border-box;width:100%;padding:12px;margin-top:6px;border:1px solid #aab4bb;border-radius:6px;font:inherit}
button{background:#174b43;color:white;border:0;border-radius:6px;padding:14px 20px;margin-top:24px;font:inherit;cursor:pointer}
p{line-height:1.6;color:#4b5963}small{display:block;margin-top:8px;color:#4b5963}</style>
<main><h1>Private deployment setup</h1>
<p>Enter your DataForSEO <strong>API credentials</strong> below. These stay in this
computer's deployment configuration, excluded from GitHub. Deployment will later
send the API credential to your Cloudflare Worker as a secret.</p>
<form method="post" action="${route}" autocomplete="off">
<label>DataForSEO API login<input name="login" type="email" required maxlength="254" autocomplete="off"></label>
<label>DataForSEO API password<input name="password" type="password" required maxlength="2048" autocomplete="new-password"></label>
<label>Your sign-in email<input name="email" type="email" required maxlength="254" autocomplete="off"></label>
<small>Only this email will be allowed through the platform's Cloudflare login gate.</small>
<button type="submit">Save private configuration</button></form>
<p>No API requests or paid SEO jobs run when you save.</p></main></html>`;

const server = createServer(async (request, response) => {
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    "X-Content-Type-Options": "nosniff",
    // Native form POSTs need their same-origin Origin header for the CSRF check.
    // no-referrer makes browsers send an opaque/null origin on this navigation.
    "Referrer-Policy": "same-origin",
  };
  const reply = (status, content) => {
    response.writeHead(status, headers);
    response.end(content);
  };
  if (request.headers.host !== new URL(origin).host || request.url !== route) {
    reply(404, "Not found");
    return;
  }
  if (saved) {
    reply(
      200,
      "Configuration saved. You can close this tab and return to the task.",
    );
    return;
  }
  if (request.method === "GET") {
    reply(200, page);
    return;
  }
  if (
    request.method !== "POST" ||
    request.headers.origin !== origin ||
    request.headers["content-type"]?.split(";")[0].trim() !==
      "application/x-www-form-urlencoded"
  ) {
    reply(403, "Request rejected");
    return;
  }
  try {
    let body = "";
    for await (const chunk of request) {
      body += chunk.toString("utf8");
      if (Buffer.byteLength(body) > 16384) {
        reply(413, "Form is too large");
        return;
      }
    }
    const fields = new URLSearchParams(body);
    const login = (fields.get("login") ?? "").trim();
    const password = fields.get("password") ?? "";
    const email = (fields.get("email") ?? "").trim();
    const validEmail =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (
      !validEmail.test(login) ||
      !validEmail.test(email) ||
      login.length > 254 ||
      email.length > 254 ||
      !password ||
      password.length > 2048 ||
      /[\r\n\0]/.test(password)
    ) {
      reply(
        400,
        "Please go back and enter valid API credentials and a sign-in email.",
      );
      return;
    }
    const credential = Buffer.from(`${login}:${password}`, "utf8").toString(
      "base64",
    );
    writeFileSync(
      destination,
      `AUTH_MODE=cloudflare_access\nDATAFORSEO_API_KEY=${credential}\nACCESS_ALLOWED_EMAILS=${JSON.stringify(email)}\nOPENSEO_TELEMETRY_DISABLED=1\n`,
      { flag: "wx", mode: 0o600 },
    );
    saved = true;
    reply(
      200,
      "<h1>Configuration saved</h1><p>You can close this tab and return to the task. No SEO requests have been made.</p>",
    );
    console.log(
      "Private deployment configuration saved. No credentials printed.",
    );
    server.close();
  } catch {
    reply(
      500,
      "Configuration could not be saved. No existing file was overwritten.",
    );
  }
});
server.listen(0, "127.0.0.1", () => {
  origin = `http://127.0.0.1:${server.address().port}`;
  console.log(`Open the private setup form: ${origin}${route}`);
});
