# E-Com API Tester

Standalone React UI for every gateway endpoint (auth, products, orders). Host this separately from the Spring Boot services.

## Prerequisites

Start the backend in order (see root README), then wait ~10–15s for Eureka registration.

## Local development

```bash
cd test-ui
npm install
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` → `http://localhost:8080` (API gateway). No env file needed.

## Production build (host on a server)

1. Point the UI at your gateway:

```bash
cp .env.example .env
# edit .env — example:
# VITE_API_BASE_URL=https://api.yourdomain.com
```

2. Build static assets:

```bash
npm install
npm run build
```

Output is in `dist/`. Serve that folder with nginx, Caddy, S3+CloudFront, GitHub Pages, etc.

3. Allow the frontend origin on the gateway (comma-separated patterns):

```properties
# api-gateway application.properties or env override
app.cors.allowed-origins=https://ui.yourdomain.com,http://localhost:*
```

Example nginx snippet for the UI:

```nginx
server {
  listen 80;
  root /var/www/ecom-ui;
  index index.html;
  location / {
    try_files $uri /index.html;
  }
}
```

## Project layout

```
src/
  App.tsx                 # shell: tabs + session + request runner
  api.ts                  # fetch helper + VITE_API_BASE_URL
  types.ts
  components/
    Header.tsx
    AuthTab.tsx
    ProductsTab.tsx
    OrdersTab.tsx
    ResponsePanel.tsx
    ProductFields.tsx
```

## What you can test

| Tab | Endpoints |
|-----|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | list / get / create / update / delete / reserve stock |
| Orders | place order / my orders / get by id |

Successful register/login stores the JWT in `localStorage` and attaches it to protected calls.
