### testing.md — Endpoint testing guide (Postman-style)

This document lists endpoint testing criteria, authorization requirements, expected responses, and Postman testing suggestions. Use a Postman environment with these variables:

- `base_url` = `http://localhost:5000` (or your backend URL)
- `auth_token` = (set after login)

General headers for protected calls:

- `Content-Type: application/json`
- `Authorization: Bearer {{auth_token}}`

1) Authentication

- Signup
  - Method: `POST` `{{base_url}}/api/auth/signup`
  - Body (JSON): `{ "name": "Test User", "email": "test@example.com", "password": "Password123" }`
  - Expect: `201 Created`, body contains `user` and/or success message.

- Login
  - Method: `POST` `{{base_url}}/api/auth/login`
  - Body (JSON): `{ "email": "test@example.com", "password": "Password123" }`
  - Expect: `200 OK`, response JSON contains `token` and `user`.
  - Postman: Save `token` to `{{auth_token}}` via Tests script: `pm.environment.set('auth_token', pm.response.json().token)`.

- Forgot/Reset Password
  - Request reset: `POST /api/auth/forgot-password` with `{ "email": "test@example.com" }`.
  - Reset: `POST /api/auth/reset-password` with `{ "token": "<resetToken>", "password": "NewPass123" }`.
  - Expect appropriate 200 responses and email logic (may require a testing SMTP or a mocked service).

2) Products

- List products
  - `GET {{base_url}}/api/products` — expect `200 OK`, array of products, supports query params: `?page=1&limit=20&category=...&q=search`.

- Get product
  - `GET {{base_url}}/api/products/:id` — expect `200 OK` and product fields (name, price, stock, images, category).

- Create product (admin)
  - `POST {{base_url}}/api/products` — requires `Authorization: Bearer {{auth_token}}` where `user.role === 'admin'`.
  - Body example: `{ "name": "New Product", "price": 1999, "category": "<categoryId>", "description": "..." }`
  - Expect `201 Created` and returned product object.
  - Negative tests: non-admin token → `403 Forbidden`; missing required fields → `400 Bad Request`.

- Update / Delete product
  - `PUT /api/products/:id` and `DELETE /api/products/:id` — admin-only, expect `200` or `204` on success.

3) Categories

- List: `GET /api/categories` → `200` and categories array.
- Create: `POST /api/categories` → admin only; test 201 and validation errors.

4) Orders

- Create order
  - `POST {{base_url}}/api/orders` with authenticated user and body containing items, shipping info, payment details (or token).
  - Expect `201 Created` with order id and summary.

- Get orders
  - `GET /api/orders` — for admin returns all orders; for user returns user-specific orders. Verify role-based behavior.

- Update status (admin)
  - `PUT /api/orders/:id/status` — body: `{ "status": "shipped" }`. Expect `200 OK` and updated order.

5) Cards / Payments

- Create payment/card
  - `POST /api/cards` — test success path and invalid card data.
  - If third-party payment (Stripe/UPI) integrated, stub or use sandbox credentials.

6) Notifications

- `GET /api/notifications` — expect only user's notifications.
- `POST /api/notifications/mark-read` — mark notifications read.

7) Admin routes & Access Control

- For every admin route, test:
  - No token → `401 Unauthorized`
  - Valid user token but non-admin → `403 Forbidden`
  - Admin token → success (200/201)

8) Error cases and validation tests

- Missing fields → `400 Bad Request` with validation error messages.
- Invalid IDs → `404 Not Found` (for product/order/category lookups).
- Malformed JWT → `401 Unauthorized`.

9) Postman collection & tests (recommended)

- Create a collection with folders: `Auth`, `Products`, `Categories`, `Orders`, `Payments`, `Notifications`, `Admin`.
- Add pre-request script for `base_url` if needed.
- Add tests that assert status codes and required response properties. Example Postman test snippet:

  pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Response has token", function () {
    var json = pm.response.json();
    pm.expect(json).to.have.property('token');
  });

- Use environment variables: `base_url`, `auth_token`, `productId`, `orderId` to pass values between requests.

10) Smoke test flow (minimal happy-path sequence)

  1. `POST /api/auth/signup` → create user
  2. `POST /api/auth/login` → save `auth_token`
  3. `POST /api/categories` (admin) → create category (requires admin token)
  4. `POST /api/products` (admin) → create product
  5. `GET /api/products` → verify product present
  6. `POST /api/orders` (user) → create order
  7. `GET /api/orders/:id` → verify order details

If you want, I can generate a ready-to-import Postman collection (JSON) that contains these requests and tests. Tell me whether you prefer a `local` backend (`http://localhost:5000`) or a deployed base URL, and whether you want sandbox payment credentials included.

---
Created by the maintainer assistant to centralize endpoint testing instructions.