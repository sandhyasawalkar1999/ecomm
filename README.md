# E-Commerce Platform Backend

## Overview

This project is a RESTful API server that serves as the backend for an e-commerce platform. It includes secure authentication, product management, blog management, and additional features like wishlist management, product ratings, user address management, coupon system, cart management, order processing, and payment gateway integration.

## Features

User Authentication & Authorization: Secure login and registration using JWT tokens and cookies.

Product Management: Create, view, sort, and paginate products.

Blog Management: Users can create blog posts, like, and comment on posts.

Wishlist Management: Users can add/remove products from their wishlist.

Product Ratings: Users can rate products and view average ratings.

User Address Management: Users can save and manage their addresses.

Coupon System: Apply discount coupons at checkout.

Cart Management: Add, update, and remove items from the shopping cart.

Order Processing: Place orders and manage order statuses.

Payment Gateway Integration: Secure transactions using an external payment gateway.

## Technologies Used

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT & Cookies

Payment Gateway: (e.g., Stripe, PayPal)

## Installation

Clone the repository:

git clone https://github.com/sandhyasawwalkar1999/ecommerce.git
cd ecommerce

## Install dependencies:

npm install

## Set up environment variables:

Create a .env file in the root directory.

Add the following environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
PAYMENT_GATEWAY_KEY=your_payment_gateway_key

## Start the server:

npm run dev

## API Endpoints

### Authentication

POST /api/auth/register - Register a new user

POST /api/auth/login - Login user

POST /api/auth/logout - Logout user

### Product Management

POST /api/products - Create a new product

GET /api/products - Get all products with sorting & pagination

GET /api/products/:id - Get a single product

PUT /api/products/:id - Update a product

DELETE /api/products/:id - Delete a product

### Blog Management

POST /api/blogs - Create a blog post

GET /api/blogs - Get all blog posts

POST /api/blogs/:id/like - Like a blog post

POST /api/blogs/:id/comment - Comment on a blog post

### Wishlist

POST /api/wishlist/:productId - Add a product to wishlist

GET /api/wishlist - View wishlist

DELETE /api/wishlist/:productId - Remove a product from wishlist

### Cart & Orders

POST /api/cart - Add an item to cart

GET /api/cart - View cart

POST /api/order - Place an order

GET /api/orders - View all orders

### Payment

POST /api/payment - Process payment via a gateway


Contributing

Contributions are welcome! Please create a pull request or open an issue for discussion.

Contact

For any inquiries, contact [sandhya sawalkar] at [sandhyasawalkar1999@gmail.com].
