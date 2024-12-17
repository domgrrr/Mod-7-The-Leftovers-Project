# FRESHLY API Documentation

![DBSchemaV1](https://github.com/user-attachments/assets/8957bcc6-de54-4fd0-9e0e-af66d65682d5)

## 1. User Authentication

### Register a New User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Allows users to create an account.
- **Request Body**:
  ```json
  {
    "username": "string (required)",
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User registered successfully",
      "user_id": "integer"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Username or email already exists"
    }
    ```

---

### User Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Allows users to log in.
- **Request Body**:
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful",
      "token": "string"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "error": "Invalid email or password"
    }
    ```

---

### User Logout
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logs out a user.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Logout successful"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "error": "Invalid token"
    }
    ```

---

## 2. Pantry Inventory

### Add Pantry Item
- **Endpoint**: `POST /api/pantry`
- **Description**: Adds a new pantry item.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string (required)",
    "category": "string",
    "quantity": "integer",
    "unit": "string (e.g., lbs, pieces)",
    "expiration_date": "YYYY-MM-DD"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Pantry item added successfully",
      "item_id": "integer"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Invalid data"
    }
    ```

---

### Update Pantry Item
- **Endpoint**: `PUT /api/pantry/{item_id}`
- **Description**: Updates a pantry item.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "category": "string",
    "quantity": "integer",
    "unit": "string",
    "expiration_date": "YYYY-MM-DD"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Pantry item updated successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Item not found"
    }
    ```

---

### Delete Pantry Item
- **Endpoint**: `DELETE /api/pantry/{item_id}`
- **Description**: Deletes a pantry item.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Pantry item deleted successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Item not found"
    }
    ```

---

### List Pantry Items
- **Endpoint**: `GET /api/pantry`
- **Description**: Retrieves all pantry items.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `category`: Filter items by category
  - `expires_soon`: Boolean (`true/false`)
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": 1,
        "name": "Apples",
        "category": "Fruits",
        "quantity": 5,
        "unit": "pieces",
        "expiration_date": "2024-07-01"
      },
      {
        "id": 2,
        "name": "Milk",
        "category": "Dairy",
        "quantity": 1,
        "unit": "gallon",
        "expiration_date": "2024-06-20"
      }
    ]
    ```

---

## 3. Grocery List

### Create a Grocery List
- **Endpoint**: `POST /api/grocery`
- **Description**: Creates a new grocery list.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string (required)"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Grocery list created",
      "list_id": 1
    }
    ```

---

### Add Item to Grocery List
- **Endpoint**: `POST /api/grocery/{list_id}/items`
- **Description**: Adds an item to a grocery list.
- **Request Body**:
  ```json
  {
    "item_name": "string (required)",
    "quantity": "integer",
    "unit": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Item added to grocery list"
    }
    ```

---

### Mark Grocery List Item as Purchased
- **Endpoint**: `PATCH /api/grocery/{list_id}/items/{item_id}`
- **Description**: Marks a grocery list item as purchased.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Item marked as purchased"
    }
    ```

---

## 4. Recipe Integration

### Suggest Recipes Based on Pantry Items
- **Endpoint**: `GET /api/recipes/suggestions`
- **Description**: Suggests recipes using current pantry items.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "recipe_id": 1,
        "name": "Apple Pie",
        "ingredients": ["Apples", "Flour", "Butter"],
        "instructions": "Step-by-step instructions here"
      }
    ]
    ```

---

## 5. Notifications

### Get Notifications
- **Endpoint**: `GET /api/notifications`
- **Description**: Retrieves notifications for low-stock or expiring items.
- **Response**:
  - **200 OK**:
    ```json
    [
      {"message": "Milk is expiring soon (06-20-2024)"},
      {"message": "Eggs are running low (3 left)"}
    ]
    ```

---

## 6. Error Handling

### Standardized Error Response Format
```json
{
  "error": "Error message here"
}
```

| **Status Code** | **Description**           |
|-----------------|---------------------------|
| 400             | Bad Request               |
| 401             | Unauthorized Access       |
| 403             | Forbidden                 |
| 404             | Resource Not Found        |
| 500             | Internal Server Error     |

---

This API documentation provides clear routes for **FRESHLY**, ensuring structured development and easy use for frontend or external integrations.
