Hosting-specific header settings

Netlify
- Create a file named `_headers` in the publish directory (root) with the header block. Example provided in `_headers` file in this repo.

Nginx
- Add the `nginx-security.conf` snippet inside your server { } block. Reload Nginx.

Apache
- Use the provided `.htaccess` or add the headers into your VirtualHost config. Ensure `mod_headers` is enabled.

GitHub Pages
- GitHub Pages serves via GitHub's CDN and doesn't allow custom response headers directly. Workarounds:
  - Use a CDN/edge provider (Cloudflare) to add headers.
  - Use a small proxy server (e.g., Cloudflare Workers, Netlify) in front of Pages to inject headers.

Cloud Providers
- Netlify: `_headers` file or Netlify UI headers settings.
- Vercel: `vercel.json` rewrites/headers (see Vercel docs).
- S3 + CloudFront: set headers on CloudFront behaviors or Lambda@Edge function to add headers.

Notes
- HSTS is only meaningful under HTTPS. Do not enable HSTS in testing on plain HTTP unless you understand the effect.
- CSP is strict — test gradually. Use `report-uri`/`report-to` to collect violations before hardening.
