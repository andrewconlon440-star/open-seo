# Signal House Media marketing site

Static production site for `signalhousemedia.com.au`.

The primary brand image is the existing Signal House Media logo supplied from
the owner's local asset library. The site palette is drawn from its black, warm
gold and ivory treatment.

## Preview

Serve this directory with any static web server. The site has no build step and
no external runtime dependencies.

## Publishing

Deployed on Cloudflare Workers Static Assets as `signal-house-media`.

- Production: <https://signalhousemedia.com.au>
- Alternate: <https://www.signalhousemedia.com.au>
- Cloudflare fallback: <https://signal-house-media.andrewconlon440.workers.dev>

Cloudflare manages the domain's DNS. The Microsoft 365 email, DKIM, SPF and
DMARC records remain DNS-only and separate from the website Worker.

## Accuracy notes

- The Allsawted rating and review count are dated observations from 8 September
  2026 and are not presented as results caused by Signal House Media.
- Platform capabilities are labelled `Now`, `Building` and `Next` so planned
  automation is not presented as already available.
- The contact address comes from the GoDaddy Signal House Media account setup.
