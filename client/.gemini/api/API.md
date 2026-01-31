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

- **URL:** `/login`
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
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
  }
  ```

### Register

Create a new organization and an admin user.

- **URL:** `/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword",
    "full_name": "Admin User",
    "organization_name": "My Sports Club"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "data": {
      "message": "User registered successfully"
    }
  }
  ```
