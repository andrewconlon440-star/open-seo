import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  copyFile,
  readFile,
  rm,
  access,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";

test("private setup rejects cross-origin writes and saves only validated configuration", async () => {
  const folder = await mkdtemp(path.join(tmpdir(), "signal-house-setup-"));
  const scripts = path.join(folder, "scripts");
  await mkdir(scripts);
  const script = path.join(scripts, "configure-selfhost.mjs");
  await copyFile(new URL("./configure-selfhost.mjs", import.meta.url), script);
  const child = spawn(process.execPath, [script], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  const exited = once(child, "exit");
  try {
    let output = "";
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Setup did not start")),
        10000,
      );
      child.stdout.on("data", (chunk) => {
        output += chunk;
        const match = output.match(
          /http:\/\/127\.0\.0\.1:\d+\/setup\/[a-f0-9]+/,
        );
        if (match) {
          clearTimeout(timer);
          resolve(match[0]);
        }
      });
      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
    const origin = new URL(url).origin;
    const fields = new URLSearchParams({
      login: "api@example.com",
      password: "test-only-password",
      email: "owner#tag@example.com",
    });
    const form = await fetch(url);
    assert.equal(form.status, 200);
    assert.equal(form.headers.get("cache-control"), "no-store");
    assert.equal(form.headers.get("referrer-policy"), "same-origin");
    assert.match(
      form.headers.get("content-security-policy"),
      /frame-ancestors 'none'/,
    );
    const rejected = await fetch(url, {
      method: "POST",
      headers: { Origin: "https://untrusted.example" },
      body: fields,
    });
    assert.equal(rejected.status, 403);
    await assert.rejects(access(path.join(folder, ".env.selfhost")));
    const invalid = await fetch(url, {
      method: "POST",
      headers: { Origin: origin },
      body: new URLSearchParams({
        login: "api@example.com",
        password: "test",
        email: "owner@example.com\nINJECTED=1",
      }),
    });
    assert.equal(invalid.status, 400);
    const accepted = await fetch(url, {
      method: "POST",
      headers: { Origin: origin },
      body: fields,
    });
    assert.equal(accepted.status, 200);
    await accepted.text();
    await exited;
    const stored = await readFile(path.join(folder, ".env.selfhost"), "utf8");
    assert.match(stored, /ACCESS_ALLOWED_EMAILS="owner#tag@example.com"/);
    assert.ok(
      stored.includes(
        Buffer.from("api@example.com:test-only-password").toString("base64"),
      ),
    );
    assert.ok(!output.includes("test-only-password"));
    assert.ok(!output.includes("api@example.com"));
    const retry = spawn(process.execPath, [script], { stdio: "ignore" });
    assert.equal((await once(retry, "exit"))[0], 1);
    assert.equal(
      await readFile(path.join(folder, ".env.selfhost"), "utf8"),
      stored,
    );
  } finally {
    child.kill();
    assert.ok(
      path.resolve(folder).startsWith(path.resolve(tmpdir()) + path.sep),
    );
    await rm(folder, { recursive: true, force: true });
  }
});
