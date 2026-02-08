# Template Fullstack API Documentation

This document describes the available endpoints, their inputs, and outputs.

## Base URL

`http://localhost:8080`

## Authentication

Most endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <your-token>`

---

## Public Endpoints

### Health Check

Check if the service is up.

- **URL:** `/health`
- **Method:** `GET`
- **Response:** `200 OK`
  ```json
  {
    "data": {
      "status": "OK"
    }
  }
  ```

### Login

Authenticate and receive a JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
  ```

### Register

Create a new user.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "full_name": "New User"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "message": "User registered successfully"
  }
  ```

---

## Backoffice Endpoints (Protected)

These endpoints manage roles, permissions, and the dynamic menu. They require appropriate permissions (e.g., `auth.role.read`, `auth.role.write`).

### Get My Menu

Returns the dynamic menu structure filtered by the user's permissions.

- **URL:** `/backoffice/me/menu`
- **Method:** `GET`
- **Response:** `200 OK`
  ```json
  {
    "data": [
      {
        "label": "Dashboard",
        "path": "/dashboard",
        "icon": "dashboard"
      },
      {
        "label": "CMS",
        "icon": "article",
        "children": [...]
      }
    ]
  }
  ```

### Get Roles

List all available roles.

- **URL:** `/backoffice/roles`
- **Method:** `GET`
- **Response:** `200 OK`
  ```json
  {
    "data": [
      { "id": 1, "name": "Admin" },
      { "id": 2, "name": "Editor" }
    ]
  }
  ```

### Create Role

- **URL:** `/backoffice/roles`
- **Method:** `POST`
- **Body:**
  ```json
  { "name": "Editor" }
  ```
- **Response:** `201 Created`

### Assign Permission to Role

- **URL:** `/backoffice/roles/{roleID}/permissions`
- **Method:** `POST`
- **Body:**
  ```json
  { "permission_id": "cms.page.create" }
  ```
- **Response:** `200 OK`

### Assign Role to User

- **URL:** `/backoffice/users/{userID}/roles`
- **Method:** `POST`
- **Body:**
  ```json
  { "role_id": 1 }
  ```
- **Response:** `200 OK`

---

## CMS Endpoints (Protected)

All endpoints below require a valid JWT token.

### Create Draft Page

- **URL:** `/pages`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "title": "My New Page"
  }
  ```
- **Response:** `201 Created`

### Get Page by Slug

- **URL:** `/pages/{slug}`
- **Method:** `GET`
- **Response:** `200 OK` (includes full layout)

### Update Page Metadata

- **URL:** `/pages/{id}/metadata`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "slug": "updated-slug",
    "seo_description": "New description",
    "keywords": ["cms", "dynamic"]
  }
  ```
- **Response:** `200 OK`

### Update Page Layout

Update the entire hierarchical structure of rows, columns, and blocks.

- **URL:** `/pages/{id}/layout`
- **Method:** `PUT`
- **Body:**
  ```json
  [
    {
      "sort_order": 0,
      "css_class": "container",
      "columns": [
        {
          "width_md": "6",
          "blocks": [
            {
              "type": "text",
              "content": { "html": "<p>Hello World</p>" }
            }
          ]
        }
      ]
    }
  ]
  ```
- **Response:** `200 OK`

### Publish Page

- **URL:** `/pages/{id}/publish`
- **Method:** `POST`
- **Response:** `200 OK`

### Archive Page

- **URL:** `/pages/{id}/archive`
- **Method:** `POST`
- **Response:** `200 OK`
