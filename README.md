# Campuswolf - Campus Delivery Service

**Campuswolf** is a full-stack web application designed as a premium campus delivery service. It connects students with local shops and delivery partners, creating a seamless ecosystem for ordering and receiving goods. The application features a sleek, dark-themed UI inspired by modern service platforms.

This project is built with a **Node.js/Express** backend that serves a dynamic frontend built with **Vanilla JavaScript**.

## Features

The application provides distinct dashboards and functionalities for four different user roles:

### 👨‍🎓 Student
- **Browse Shops:** Explore a list of available shops, filter by category, and search by name.
- **View Menus:** Select a shop to view its detailed menu and product information.
- **Place Orders:** Add items to a cart and place an order directly with the shop.
- **Track Orders:** A dedicated "My Orders" page shows the real-time status of all past and present orders.
- **Pay via QR:** Once an order is confirmed, students can view the shop's QR code to make payments.

### 🏪 Shopkeeper
- **Order Management:** View a live list of incoming orders from students.
- **Confirm/Reject Orders:** Accept or decline new orders.
- **Set Pricing:** When confirming an order, the shopkeeper sets the final total price.
- **Dispatch for Delivery:** Confirmed orders are automatically made available to delivery partners.

### 🏍️ Delivery Partner
- **View Available Jobs:** See a list of confirmed orders that are ready for pickup.
- **Accept Deliveries:** Choose and accept delivery tasks.
- **Update Status:** Manage a personal list of accepted deliveries and update the order status from "Picking Up" to "Out for Delivery" and finally "Delivered".
- **Payment Verification:** Verify the student's payment screenshot before marking the order as delivered.

### ⚙️ Admin
- **Central Dashboard:** Get an overview of the platform's key metrics like total orders, users, and revenue.
- **Manage Orders:** View a comprehensive table of all orders processed on the platform.
- **Manage Users:** View all registered users and create new accounts for Shopkeepers and Delivery Partners.

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla JavaScript (ES6), HTML5, Tailwind CSS (via CDN)
- **Data Persistence:** In-memory mock data (data resets when the server restarts).

> **Note on React Source Files:** This repository also contains a complete set of React/TypeScript (`.tsx`) source files in the `/components`, `/contexts`, etc., directories. These represent an alternative, more modern frontend implementation but are not currently built or served by the Node.js server. The active, running frontend is the Vanilla JS version in `/public/app.js`.

---

## Getting Started

To run this project locally, you will need to have [Node.js](https://nodejs.org/) and `npm` installed.

### 1. Installation

Clone the repository and navigate into the project directory. Then, install the backend dependencies:

```bash
npm install
```

### 2. Running the Application

Start the Express server:

```bash
npm start
```

The server will start on `http://localhost:3000`.

### 3. Accessing the App

Open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## Demo Accounts

You can use the following pre-seeded accounts to test the application. Any password will work for these demo accounts.

| Role              | Email                  | Password |
| ----------------- | ---------------------- | -------- |
| **Student**       | `alice@campus.edu`     | `(any)`  |
| **Shopkeeper**    | `bob@shop.com`         | `(any)`  |
| **Delivery Partner**| `charlie@delivery.com` | `(any)`  |
| **Admin**         | `admin@campuswolf.com` | `(any)`  |
