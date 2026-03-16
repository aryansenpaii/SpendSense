# SpendSense API Testing Guide

You can use the following requests in Postman (or cURL) to test the SpendSense APIs.

**Base URL**: `http://localhost:8080`

---

## 1. Authentication

### Register User
Create a new user account.
* **Method**: `POST`
* **URL**: `/api/auth/register`
* **Headers**: `Content-Type: application/json`
* **Body (raw JSON)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
Authenticate and receive a JWT token.
* **Method**: `POST`
* **URL**: `/api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Body (raw JSON)**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Important:** Copy the `token` from the response. You will need to pass it in the Headers for all subsequent requests as:
`Authorization: Bearer <your_copied_token>`

---

## 2. Expenses

### Add Expense
Create a new expense for the logged-in user. Note: You must ensure a category exists in your database first with ID `1` (for example, run a manual SQL insert for testing, or assume you have a category ID ready).
* **Method**: `POST`
* **URL**: `/api/expenses`
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <token>`
* **Body (raw JSON)**:
```json
{
  "amount": 150.50,
  "description": "Weekly Groceries",
  "date": "2024-03-15T14:30:00",
  "categoryId": 1
}
```

### Get All Expenses
Retrieve all expenses for the logged-in user.
* **Method**: `GET`
* **URL**: `/api/expenses`
* **Headers**: 
  * `Authorization: Bearer <token>`

### Update Expense
Modify an existing expense. Replace `{id}` in the URL with the actual expense ID.
* **Method**: `PUT`
* **URL**: `/api/expenses/{id}`
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <token>`
* **Body (raw JSON)**:
```json
{
  "amount": 165.00,
  "description": "Weekly Groceries + Snacks",
  "date": "2024-03-15T14:30:00",
  "categoryId": 1
}
```

### Delete Expense
Remove an expense. Replace `{id}` with the actual expense ID.
* **Method**: `DELETE`
* **URL**: `/api/expenses/{id}`
* **Headers**: 
  * `Authorization: Bearer <token>`

### Get Expenses by Category Name
Filter expenses. Replace `{categoryName}` with the actual name (e.g., `FOOD`).
* **Method**: `GET`
* **URL**: `/api/expenses/category/{categoryName}`
* **Headers**: 
  * `Authorization: Bearer <token>`

---

## 3. Analytics

### Monthly Summary
Get a summary of expenses aggregated by month.
* **Method**: `GET`
* **URL**: `/api/analytics/monthly-summary`
* **Headers**: 
  * `Authorization: Bearer <token>`

### Category Summary
Get a summary of expenses aggregated by category.
* **Method**: `GET`
* **URL**: `/api/analytics/category-summary`
* **Headers**: 
  * `Authorization: Bearer <token>`

---

## 4. Categories

### Get All Categories
Retrieve all available categories.
* **Method**: `GET`
* **URL**: `/api/categories`
* **Headers**: 
  * `Authorization: Bearer <token>`

### Add New Category
Create a new category.
* **Method**: `POST`
* **URL**: `/api/categories`
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <token>`
* **Body (raw JSON)**:
```json
{
  "name": "Health & Fitness"
}
```
