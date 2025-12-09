# API Documentation

## Base URL

```
Development: http://localhost:8000/api
Production: https://your-backend-url.com/api
```

All endpoints are prefixed with the base URL. Authentication is required for most endpoints using JWT Bearer tokens.

---

## Table of Contents

- [Authentication](#authentication)
- [Products](#products)
- [Cart](#cart)
- [Wishlist](#wishlist)
- [Orders](#orders)
- [Addresses](#addresses)
- [Admin Panel](#admin-panel)

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /register/`

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false
  }
}
```

---

### Login

Authenticate with email and password.

**Endpoint:** `POST /login/`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false
  }
}
```

---

### Google OAuth Login

Authenticate using Google OAuth.

**Endpoint:** `POST /google/`

**Request Body:**

```json
{
  "id_token": "google-oauth-id-token"
}
```

**Response:** `200 OK`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false
  }
}
```

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /refresh/`

**Request Body:**

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Current User

Get authenticated user details.

**Endpoint:** `GET /me/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false,
  "is_blocked": false
}
```

---

### Logout

Invalidate the current session.

**Endpoint:** `POST /logout/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

## Products

### List Products

Get all products with optional filtering.

**Endpoint:** `GET /products/`

**Query Parameters:**

- `search` (string, optional) - Search by product name or description
- `category` (string, optional) - Filter by category
- `min_price` (number, optional) - Minimum price filter
- `max_price` (number, optional) - Maximum price filter
- `page` (number, optional) - Page number for pagination
- `page_size` (number, optional) - Items per page

**Example Request:**

```
GET /products/?search=shirt&category=clothing&min_price=10&max_price=100
```

**Response:** `200 OK`

```json
{
  "count": 45,
  "next": "http://api.example.com/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Classic T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "price": "29.99",
      "category": "Clothing",
      "stock": 50,
      "image": "http://example.com/media/products/tshirt.jpg",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Product Details

Get detailed information about a specific product.

**Endpoint:** `GET /products/{id}/`

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "Classic T-Shirt",
  "description": "Comfortable cotton t-shirt perfect for everyday wear",
  "price": "29.99",
  "category": "Clothing",
  "stock": 50,
  "image": "http://example.com/media/products/tshirt.jpg",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

---

## Cart

### Get Cart

Get the current user's cart items.

**Endpoint:** `GET /cart/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Classic T-Shirt",
        "price": "29.99",
        "image": "http://example.com/media/products/tshirt.jpg",
        "stock": 50
      },
      "quantity": 2,
      "subtotal": "59.98"
    }
  ],
  "total": "59.98"
}
```

---

### Add to Cart

Add a product to the cart.

**Endpoint:** `POST /cart/add/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "product": {
    "id": 1,
    "name": "Classic T-Shirt",
    "price": "29.99",
    "image": "http://example.com/media/products/tshirt.jpg",
    "stock": 50
  },
  "quantity": 2,
  "subtotal": "59.98"
}
```

---

### Update Cart Item

Update the quantity of a cart item.

**Endpoint:** `PATCH /cart/{id}/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "product": {
    "id": 1,
    "name": "Classic T-Shirt",
    "price": "29.99",
    "image": "http://example.com/media/products/tshirt.jpg",
    "stock": 50
  },
  "quantity": 3,
  "subtotal": "89.97"
}
```

---

### Remove from Cart

Remove an item from the cart.

**Endpoint:** `DELETE /cart/{id}/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `204 No Content`

---

## Wishlist

### Get Wishlist

Get the current user's wishlist items.

**Endpoint:** `GET /cart/wishlist/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": 1,
      "product": {
        "id": 2,
        "name": "Premium Hoodie",
        "price": "59.99",
        "image": "http://example.com/media/products/hoodie.jpg",
        "stock": 25
      },
      "added_at": "2024-01-20T15:30:00Z"
    }
  ]
}
```

---

### Add to Wishlist

Add a product to the wishlist.

**Endpoint:** `POST /cart/wishlist/add/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "product_id": 2
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "product": {
    "id": 2,
    "name": "Premium Hoodie",
    "price": "59.99",
    "image": "http://example.com/media/products/hoodie.jpg",
    "stock": 25
  },
  "added_at": "2024-01-20T15:30:00Z"
}
```

---

### Remove from Wishlist

Remove an item from the wishlist.

**Endpoint:** `DELETE /cart/wishlist/{id}/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `204 No Content`

---

## Orders

### Create Order

Create a new order from cart items.

**Endpoint:** `POST /orders/create/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "address_id": 1,
  "payment_method": "cod"
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "order_number": "ORD-2024-0001",
  "items": [
    {
      "product": {
        "id": 1,
        "name": "Classic T-Shirt",
        "price": "29.99"
      },
      "quantity": 2,
      "price": "29.99",
      "subtotal": "59.98"
    }
  ],
  "total": "59.98",
  "payment_status": "unpaid",
  "order_status": "processing",
  "payment_method": "cod",
  "address": {
    "id": 1,
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "created_at": "2024-01-20T16:00:00Z"
}
```

---

### Create Stripe Checkout Session

Create a Stripe checkout session for online payment.

**Endpoint:** `POST /orders/create-checkout-session/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "address_id": 1
}
```

**Response:** `200 OK`

```json
{
  "session_id": "cs_test_a1b2c3d4e5f6g7h8i9j0",
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

---

### Verify Payment

Verify Stripe payment after checkout.

**Endpoint:** `GET /orders/verify-payment/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `session_id` (string, required) - Stripe session ID

**Response:** `200 OK`

```json
{
  "success": true,
  "order": {
    "id": 1,
    "order_number": "ORD-2024-0001",
    "payment_status": "paid",
    "order_status": "processing"
  }
}
```

---

### Get My Orders

Get all orders for the authenticated user.

**Endpoint:** `GET /orders/my/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-2024-0001",
      "total": "59.98",
      "payment_status": "paid",
      "order_status": "shipped",
      "payment_method": "stripe",
      "created_at": "2024-01-20T16:00:00Z",
      "items_count": 2
    }
  ]
}
```

---

### Get Order Details

Get detailed information about a specific order.

**Endpoint:** `GET /orders/{id}/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "order_number": "ORD-2024-0001",
  "items": [
    {
      "product": {
        "id": 1,
        "name": "Classic T-Shirt",
        "image": "http://example.com/media/products/tshirt.jpg"
      },
      "quantity": 2,
      "price": "29.99",
      "subtotal": "59.98"
    }
  ],
  "total": "59.98",
  "payment_status": "paid",
  "order_status": "shipped",
  "payment_method": "stripe",
  "address": {
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "created_at": "2024-01-20T16:00:00Z",
  "updated_at": "2024-01-21T10:00:00Z"
}
```

---

## Addresses

### List Addresses

Get all saved addresses for the authenticated user.

**Endpoint:** `GET /orders/addresses/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "addresses": [
    {
      "id": 1,
      "full_name": "John Doe",
      "phone": "+1234567890",
      "address_line1": "123 Main St",
      "address_line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA",
      "is_default": true
    }
  ]
}
```

---

### Create Address

Add a new shipping address.

**Endpoint:** `POST /orders/addresses/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": true
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": true
}
```

---

### Update Address

Update an existing address.

**Endpoint:** `PUT /orders/addresses/{id}/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "456 Oak Ave",
  "address_line2": "",
  "city": "Los Angeles",
  "state": "CA",
  "postal_code": "90001",
  "country": "USA",
  "is_default": false
}
```

**Response:** `200 OK`

---

### Delete Address

Delete a shipping address.

**Endpoint:** `DELETE /orders/addresses/{id}/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `204 No Content`

---

## Admin Panel

> **Note:** All admin endpoints require authentication with an admin/staff account (`is_staff: true`).

### Dashboard Analytics

Get dashboard statistics and metrics.

**Endpoint:** `GET /panel/dashboard/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:** `200 OK`

```json
{
  "total_revenue": "15420.50",
  "total_orders": 245,
  "total_users": 1250,
  "total_products": 89,
  "recent_orders": [
    {
      "id": 1,
      "order_number": "ORD-2024-0001",
      "customer": "John Doe",
      "total": "59.98",
      "status": "shipped",
      "created_at": "2024-01-20T16:00:00Z"
    }
  ],
  "revenue_chart": [
    {
      "date": "2024-01-01",
      "revenue": "1250.00"
    }
  ]
}
```

---

### List All Users

Get all registered users (admin only).

**Endpoint:** `GET /panel/users/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:** `200 OK`

```json
{
  "users": [
    {
      "id": 1,
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_staff": false,
      "is_blocked": false,
      "date_joined": "2024-01-15T10:00:00Z",
      "orders_count": 5,
      "total_spent": "299.95"
    }
  ]
}
```

---

### Get User Details

Get detailed information about a specific user.

**Endpoint:** `GET /panel/users/{id}/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false,
  "is_blocked": false,
  "date_joined": "2024-01-15T10:00:00Z",
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-2024-0001",
      "total": "59.98",
      "status": "delivered",
      "created_at": "2024-01-20T16:00:00Z"
    }
  ],
  "total_spent": "299.95",
  "orders_count": 5
}
```

---

### Block/Unblock User

Toggle user blocked status.

**Endpoint:** `PATCH /panel/users/{id}/block/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "is_blocked": true
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "is_blocked": true
}
```

---

### Create Product

Add a new product (admin only).

**Endpoint:** `POST /products/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
name: "New Product"
description: "Product description"
price: 49.99
category: "Clothing"
stock: 100
image: <file>
```

**Response:** `201 Created`

---

### Update Product

Update an existing product.

**Endpoint:** `PUT /products/{id}/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
name: "Updated Product"
description: "Updated description"
price: 54.99
category: "Clothing"
stock: 75
image: <file> (optional)
```

**Response:** `200 OK`

---

### Delete Product

Delete a product.

**Endpoint:** `DELETE /products/{id}/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:** `204 No Content`

---

### List All Orders (Admin)

Get all orders in the system.

**Endpoint:** `GET /orders/admin/all/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:** `200 OK`

```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-2024-0001",
      "customer": {
        "id": 1,
        "email": "john.doe@example.com",
        "name": "John Doe"
      },
      "total": "59.98",
      "payment_status": "paid",
      "order_status": "shipped",
      "created_at": "2024-01-20T16:00:00Z"
    }
  ]
}
```

---

### Update Order Status

Update order and payment status.

**Endpoint:** `PATCH /orders/{id}/status/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "order_status": "delivered",
  "payment_status": "paid"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "order_number": "ORD-2024-0001",
  "payment_status": "paid",
  "order_status": "delivered"
}
```

---

### Sales Reports

Get sales reports and analytics.

**Endpoint:** `GET /panel/reports/`

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

- `start_date` (date, optional) - Start date for report (YYYY-MM-DD)
- `end_date` (date, optional) - End date for report (YYYY-MM-DD)

**Response:** `200 OK`

```json
{
  "total_revenue": "15420.50",
  "total_orders": 245,
  "average_order_value": "62.94",
  "sales_by_category": [
    {
      "category": "Clothing",
      "revenue": "8500.00",
      "orders": 150
    }
  ],
  "daily_sales": [
    {
      "date": "2024-01-20",
      "revenue": "450.00",
      "orders": 8
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Invalid request data",
  "details": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users:** 1000 requests per hour
- **Anonymous users:** 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

---

## Pagination

List endpoints support pagination with the following query parameters:

- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

Paginated responses include:

```json
{
  "count": 100,
  "next": "http://api.example.com/endpoint/?page=2",
  "previous": null,
  "results": []
}
```

---

## Webhooks

### Stripe Webhook

The backend listens for Stripe webhook events to update order payment status.

**Endpoint:** `POST /orders/stripe-webhook/`

**Headers:**

```
Stripe-Signature: <signature>
```

**Events Handled:**

- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Payment failed/expired

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** - Use httpOnly cookies or secure storage
3. **Handle token refresh** - Implement automatic token refresh on 401 errors
4. **Validate input** - Always validate user input on the client side
5. **Handle errors gracefully** - Show user-friendly error messages
6. **Use pagination** - For large datasets, always implement pagination
7. **Cache responses** - Cache product listings and static data when possible
8. **Optimize images** - Compress and resize product images before upload
