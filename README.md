# E-Com Services

Spring Boot microservices e-commerce backend with Eureka service discovery, API Gateway, and JWT Spring Security.

## Architecture

| Service | Port | Role |
|---------|------|------|
| `eureka-server` | 8761 | Service registry |
| `api-gateway` | 8080 | Entry point, JWT validation, routing |
| `auth-service` | 8081 | Register / login, JWT issuance |
| `product-service` | 8082 | Product catalog + stock |
| `order-service` | 8083 | Orders (calls product-service via Feign) |

```
Client → API Gateway (:8080) → Eureka (:8761)
                ├─ /api/auth/**     → auth-service
                ├─ /api/products/** → product-service
                └─ /api/orders/**   → order-service
```

## Stack

- Java 21, Spring Boot 4.1.0, Spring Cloud 2025.1.2
- Netflix Eureka, Spring Cloud Gateway, OpenFeign
- Spring Security + JWT (JJWT)
- H2 in-memory databases (per service)

## Build

```bash
./mvnw clean package -DskipTests
```

## Run (start in this order)

```bash
./mvnw -pl eureka-server spring-boot:run
./mvnw -pl auth-service spring-boot:run
./mvnw -pl product-service spring-boot:run
./mvnw -pl order-service spring-boot:run
./mvnw -pl api-gateway spring-boot:run
```

Wait ~10–15 seconds after all services are up so Eureka registration completes before calling the gateway.

Eureka dashboard: http://localhost:8761

## API examples (via gateway)

### Register

```bash
curl -s -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","email":"alice@example.com","password":"secret12"}'
```

### Login

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"secret12"}'
```

### List products (public)

```bash
curl -s http://localhost:8080/api/products
```

### Create product (requires JWT)

```bash
curl -s -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Keyboard","description":"Mechanical","price":79.99,"stock":25,"category":"Electronics"}'
```

### Place order (requires JWT)

```bash
curl -s -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"productId":1,"quantity":2}]}'
```

### My orders

```bash
curl -s http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

## Security notes

- Auth endpoints and `GET /api/products/**` are public.
- Creating/updating products and all order APIs require a valid Bearer JWT.
- Gateway validates the token and forwards `X-User-Name` / `X-User-Role` to downstream services.
- JWT secret is shared via `app.jwt.secret` in `auth-service` and `api-gateway` (change for production).
