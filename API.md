# 1. User Authentication

## Register a New User

* Endpoint /register

* Method: POST

* Description: Create a new user account

* Request Body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

* Response:

```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "created_at": "timestamp"
}
```

* Errors:
  * 400 Bad Request: Invalid input data
  * 409 Conflict: Email or username already exists