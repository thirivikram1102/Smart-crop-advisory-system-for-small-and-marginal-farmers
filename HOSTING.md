# Smart Crop Advisory System - Hosting & Deployment Guide

This application is a full-stack Node.js + Express + React 19 application built for small and marginal farmers in Tamil Nadu.

---

## 1. Live Instant Access (Already Hosted)

Your application is already hosted live on Google Cloud Run:

- **Public Production Web URL**:
  `https://ais-pre-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app`
- **Development & Live Preview URL**:
  `https://ais-dev-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app`

Farmers and field officers can open this link on mobile phones, tablets, or desktop browsers without any local installation.

---

## 2. Using a Custom Domain (Without "ai" in the URL)

To use your own professional domain (e.g., `www.uzhavanadvisory.in`, `smartcropadvisory.com`, or `tncrops.org`):

### Method A: Cloudflare Free SSL & Proxy (Fastest & Free)
1. Buy your domain on any registrar (Namecheap, GoDaddy, Porkbun, etc.).
2. Add your domain to Cloudflare (Free plan).
3. In Cloudflare DNS settings, add a **CNAME** record:
   - **Type**: `CNAME`
   - **Name**: `@` (or `advisory`)
   - **Target**: `ais-pre-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app`
   - **Proxy status**: Proxied (Orange cloud on)
4. Your site will immediately resolve securely under your domain (e.g. `https://uzhavanadvisory.in`) with automatic free SSL!

### Method B: Google Cloud Run Custom Domains
1. In Google Cloud Console, navigate to **Cloud Run** > Select the service (`ais-pre-...`).
2. Click **Manage Custom Domains** > **Add Mapping**.
3. Enter your domain (e.g., `cropadvisory.yourdomain.com`).
4. Add the generated DNS TXT and CNAME verification records into your domain registrar's DNS panel.
5. Google will automatically provision a free Managed Let's Encrypt SSL certificate.

---

## 3. Alternative Hosting Platforms

### Option A: Render.com / Railway
1. Push this repository to GitHub or GitLab.
2. In Render or Railway, create a new **Web Service**.
3. Set the following:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `GEMINI_API_KEY`: Your Google Gemini API Key (from Google AI Studio)
4. Deploy!

### Option B: Docker Container on Any Cloud / VPS (AWS, GCP, DigitalOcean, Hetzner)
Run with Docker:
```bash
# Build the container
docker build -t smart-crop-advisory .

# Run the container
docker run -d -p 8080:8080 -e GEMINI_API_KEY="your_api_key_here" smart-crop-advisory
```

---

## 4. Production Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key for Tamil voice assistance and leaf diagnosis fallback |
| `PORT` | Web server port (defaults to 8080 in Docker, 3000 in local dev) |
| `NODE_ENV` | Set to `production` when deployed |
