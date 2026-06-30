# Product Browser Backend

A backend service built for the CodeVector Backend Take-Home Assignment.

The application efficiently serves a catalog of **200,000 products** with **cursor-based pagination**, category filtering, and stable browsing while product data changes.

---

# Features

* Cursor-based pagination
* Category filtering
* Browse newest products first (based on `updated_at`)
* Handles large datasets efficiently (200,000 products)
* Batch seed script for generating products
* Stable browsing experience without duplicate products during pagination
* RESTful API built using Express.js
* PostgreSQL database with Prisma ORM

---

# Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* React (Optional demo frontend)

---

# Why Cursor Pagination?

Traditional offset pagination (`LIMIT/OFFSET`) works well for static data but can produce duplicate or skipped records when new rows are inserted or updated while users are browsing.

This project uses **cursor-based pagination** to provide a consistent browsing experience.

The cursor consists of:

* `updated_at`
* `id` (used as a deterministic tie-breaker)

This allows the backend to continue from the last product the user received instead of relying on shifting row positions.

---

# Browsing Strategy

I intentionally designed browsing sessions as **snapshots**.

If new products are added or existing products are updated while a user is browsing:

* The current browsing session continues without duplicates or unexpected jumps.
* Newly added or updated products appear when the user refreshes or starts a new browsing session.

This prioritizes a stable user experience.

---

# Database Design

## Product Fields

* id (UUID)
* name
* category
* price
* created_at
* updated_at

Indexes are added to support efficient filtering and sorting for cursor-based pagination.

---

# API

## Get Products

```http
GET /api/products
```

### Query Parameters

| Parameter         | Description                  |
| ----------------- | ---------------------------- |
| category          | Optional category filter     |
| limit             | Number of products to return |
| cursor_updated_at | Cursor timestamp             |
| cursor_id         | Cursor ID                    |

Example:

```http
GET /api/products?category=Electronics&limit=50
```

Example (next page):

```http
GET /api/products?limit=50&cursor_updated_at=2026-06-30T10:30:00.000Z&cursor_id=xxxxxxxx
```

---

# Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "hasNextPage": true,
    "nextCursor": {
      "updated_at": "...",
      "id": "..."
    }
  }
}
```

---

# Seed Script

The repository includes a seed script that generates **200,000 products**.

Features:

* Batch insertion
* Random product names
* Random categories
* Realistic timestamps
* Efficient database inserts

Run:

```bash
node prisma/seed.js
```

---

# Project Setup

## 1. Clone

```bash
git clone <repository-url>
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

## 4. Push Prisma schema

```bash
npx prisma db push
```

## 5. Seed the database

```bash
node prisma/seed.js
```

## 6. Start the server

```bash
npm run dev
```

---

# Testing Performed

The following scenarios were tested:

* Initial page load
* Multiple cursor requests
* Category filtering
* Category filter with pagination
* Invalid request handling
* Adding new products while browsing
* Refresh after new products are added
* Verified that products are not duplicated during continuous browsing

---

# Design Decisions

## Why PostgreSQL?

I chose PostgreSQL because it provides a robust relational database with excellent support for indexing, sorting, and filtering, making it well suited for this assignment.

## Why Prisma?

Prisma provides:

* Type-safe database access
* Simple schema management
* Clean query API
* Fast development

## Why Cursor Pagination?

Cursor pagination avoids the duplicate and skipped record problems that can occur with offset pagination when data changes.

---

# Future Improvements

If given more time, I would:

* Add automated integration tests
* Add request validation middleware
* Add structured logging
* Containerize the application using Docker
* Add API documentation using Swagger/OpenAPI
* Add caching for frequently accessed queries

---

# AI Usage

AI was used as a learning and review tool throughout this assignment.

It helped me explore pagination strategies, review architecture decisions, discuss trade-offs, and improve the overall design.

I implemented, tested, and refined the solution myself to ensure I fully understood the code and could confidently explain and modify it during the interview.

---

# Author

**Rahul Reddy**
