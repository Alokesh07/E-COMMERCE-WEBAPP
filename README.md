# E-Commerce Webapp

This repository contains a full-stack e-commerce web application with a React front-end and a Node/Express backend (MongoDB models). The project is split into two main areas:

- Frontend: `src/` — React UI, pages, components, contexts, styles and utilities.
- Backend: `backend/` — Express server, controllers, routes, models, middleware and utils.

This README documents the repository layout, how to run the app locally, environment variables, a short API summary, and links to the detailed endpoint testing guide (`testing.md`).

**Repository Structure**

- `backend/`:
	- `server.js`: Entrypoint for the Express API server.
	- `controllers/`: Request handlers for resources (e.g., `authController.js`, `productController.js`).
	- `routes/`: Route definitions that connect endpoints to controllers (e.g., `products.js`, `auth.js`).
	- `models/`: Mongoose models (e.g., `User.js`, `Product.js`, `Order.js`).
	- `middleware/auth.js`: Authentication middleware that protects routes.
	- `utils/emailService.js`: Email helper used by auth flows (password reset, notifications).

- `src/` (frontend React app):
	- `pages/`: Top-level page components (`Shop.jsx`, `Cart.jsx`, `UserProfile.jsx`, etc.).
	- `components/`: Reusable UI pieces organized by feature (Auth, Layout, Filters, Profile, Payment).
	- `context/`: React contexts to store auth, cart, filter, admin, and notification state.
	- `utils/`: Client utilities (API wrappers, price helpers, order service).
	- `styles/`: CSS files for pages and components.

- `build/`, `public/`: Production build artifacts and static assets.

**Quick Start (development)**

1. Install dependencies (root and backend):

	- From repository root (frontend):

		npm install

	- From `backend/`:

		cd backend
		npm install

2. Environment variables (backend): Create a `.env` in `backend/` with the required keys. Typical variables:

	- `PORT` — server port (default 5000)
	- `MONGO_URI` — MongoDB connection string
	- `JWT_SECRET` — secret for signing JWT tokens
	- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` — optional for email service

3. Run servers:

	- Backend (development):

		cd backend
		npm run dev

	- Frontend (development):

		npm start

The frontend expects the backend API to be available (configure `src/utils/api.js` base URL or use a proxy in `package.json`).

**API Overview**

This is a short summary. For full testing scenarios and Postman-style examples, see `testing.md`.

- Authentication
	- `POST /api/auth/signup` — register a user
	- `POST /api/auth/login` — login and receive a JWT
	- `POST /api/auth/forgot-password` — request password reset
	- `POST /api/auth/reset-password` — reset password using token

- Products
	- `GET /api/products` — list products (filters, pagination)
	- `GET /api/products/:id` — get product details
	- `POST /api/products` — create product (admin)
	- `PUT /api/products/:id` — update product (admin)
	- `DELETE /api/products/:id` — delete product (admin)

- Categories
	- `GET /api/categories` — list categories
	- `POST /api/categories` — create category (admin)

- Orders
	- `POST /api/orders` — create order (authenticated)
	- `GET /api/orders` — list orders (admin or user-specific)
	- `GET /api/orders/:id` — order details
	- `PUT /api/orders/:id/status` — update status (admin)

- Cards / Payments
	- `POST /api/cards` — create card or payment intent
	- `GET /api/cards` — list saved cards for user

- Notifications
	- `GET /api/notifications` — user notifications
	- `POST /api/notifications/mark-read` — mark as read

Authorization: Protected endpoints require an `Authorization` header: `Bearer <JWT>`. Admin-restricted endpoints check the authenticated user's role.

**Testing and Postman**

See `testing.md` for step-by-step endpoint test cases, required headers, expected responses, sample payloads, and how to set Postman environment variables such as `base_url` and `auth_token`.

**Code notes & conventions**

- Controllers return consistent JSON structures. Look at `backend/controllers/*` for shape and error handling.
- Models use Mongoose; check `backend/models` for schema fields and relations.
- Frontend `src/context` contains authorization and cart flows; tokens are stored in context/localStorage.

**Next steps / Useful commands**

- Lint / format: use project-specific scripts (if configured)
- Run backend lint/test: `cd backend && npm test` (if available)

If you'd like, I can also generate a Postman collection and environment files for quick import. See `testing.md` for details on how I organized test cases.
