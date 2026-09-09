# Signal House Media platform

Development happens on `signal-house-dev` in `andrewconlon440-star/open-seo`.
Do not deploy or commit changes directly to `main`.

## Foundation

OpenSEO remains the SEO intelligence engine. The Signal House client hub at
`/clients` uses the existing authenticated project list and project creation flow.
Each client maps to a project; existing project permissions and data scoping apply.
Research tools are available from each workspace. Adding a client does not start
a paid audit or publish anything to an external website.

Cloudflare self-hosting is the initial target. All users admitted through
Cloudflare Access share one agency workspace. This is an internal staff platform,
not a client-isolated portal. Do not invite clients until per-client access has
been designed and tested.

## First pilot

AllSawted Tree Services, Perth, Western Australia. Use Australia and English for
the project's research market. Confirm the canonical website before entering it;
do not infer a domain from the business name. Perth-specific rank tracking is a
separate configuration from the country-level research market.

Owner-confirmed business facts for AllSawted: the business is fully insured.
Its Google Business Profile showed a 5.0 rating from 39 reviews when checked on
8 September 2026. Use the rating and review count with that checked date rather
than making absolute customer-satisfaction claims.

## Low-data operating mode

Use this mode by default for Signal House Media and AllSawted work:

- Make no billable DataForSEO request until its estimated cost and scope have
  been shown to the owner and explicitly approved.
- Prefer saved research, cached results, local crawls, Google Search Console and
  free public sources before buying new data.
- Draft copy and implementation plans locally, then batch website edits into one
  publishing pass and one verification pass.
- Check Codex usage before a long browser session. If the rolling five-hour
  window is already 70% used, prepare offline work and leave non-urgent browser
  publishing until the allowance resets.
- Reuse existing tabs and page state. Avoid repeated full-page snapshots, broad
  repository searches and duplicate audits.
- Use the smallest useful rank sample: priority service, priority suburb and one
  device. Expand only when the first result justifies the cost.
- Record purchased research in the project research log so another workflow does
  not buy the same result again.

These are permanent project defaults unless the owner asks to change them.

## Delivery stages

1. Verify local build, Cloudflare deployment and Access sign-in. Configure the
   DataForSEO credential privately; never commit it or put it into chat.
2. Create the AllSawted project, confirm its domain and connect authorised Google
   Search Console and Analytics accounts. Run a deliberately scoped baseline audit
   after agreeing the API spend limit.
3. Add a persistent execution queue tied to project IDs: draft, awaiting approval,
   approved, running, completed and failed. Store evidence, proposed changes,
   approval identity, execution outcome and rollback information. Use normalised
   SQLite/Postgres tables and the existing server-function/service/repository pattern.
4. Add WordPress as the first execution adapter. Begin with draft publishing and
   previewable fixes; require explicit approval for live publication. Add bounded
   retries, idempotency and per-client credentials before unattended runs.
5. Add Google Business Profile, review workflows, local/service pages, citations
   and recurring reports. Build client-isolated access before offering a client portal.

The current client hub does not implement the execution queue or these adapters.
Do not display invented rankings, audit scores, client results or connected status.

## Secrets and deployment

Follow `SELF_HOSTING_CLOUDFLARE.md`. `.env.local` and `.env.selfhost` are ignored by
Git. DataForSEO uses a base64-encoded API login/password; base64 is not encryption.
Let the owner enter credentials into a private field and never echo their contents
in logs. Cloudflare OAuth authorisation is a separate owner approval.

For first-time local setup, `node scripts/configure-selfhost.mjs` opens a
one-time loopback form (follow the printed local URL). The owner enters the API
login, API password and permitted sign-in email. It writes `.env.selfhost` without
echoing credentials or making API calls, then stops. It refuses to overwrite an
existing file. The local env file contains a recoverable credential, not encrypted
storage; keep the computer and working directory private. Run its checks with
`node --test scripts/configure-selfhost.test.mjs`.

Use the repository's pinned package manager and Node 22.6+ (Node 24 recommended).
The `alchemy` package script uses a Node launcher that works on Windows as well as
macOS/Linux. Never use `local_noauth` for an internet-facing deployment.

Preserve the upstream licence and OpenSEO attribution when extending the product.
