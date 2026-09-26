# E-Com API Tester

React UI to exercise every gateway endpoint (auth, products, orders).

## Prerequisites

Start the backend in order (see root README), then wait ~10–15s for Eureka registration:

```bash
./mvnw -pl eureka-server spring-boot:run
./mvnw -pl auth-service spring-boot:run
./mvnw -pl product-service spring-boot:run
./mvnw -pl order-service spring-boot:run
./mvnw -pl api-gateway spring-boot:run
```

## Run

```bash
cd test-ui
npm install
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` → `http://localhost:8080` (API gateway).

## What you can test

| Tab | Endpoints |
|-----|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | list / get / create / update / delete / reserve stock |
| Orders | place order / my orders / get by id |

Successful register/login stores the JWT in `localStorage` and attaches it to protected calls.
