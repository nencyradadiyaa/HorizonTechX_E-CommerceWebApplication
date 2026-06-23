# HorizonTechX E-Commerce Store (MERN Stack)

A professional, internship-level, production-ready Full Stack E-Commerce Web Application featuring a premium developer desk setup and tech devices store. Styled with a futuristic dark theme using Tailwind CSS and built using the MERN stack with JWT authentication.

---

## ⚡ Key Features

* **Complete JWT Auth Flow**: User registration, login, profile queries, token persistence, and router guard wrappers (`ProtectedRoute`, `AdminRoute`).
* **Interactive Shopping Cart**: Dynamic subtotaling, tax simulator, free shipping triggers ($500+ threshold), and item quantity limit guards based on database stock.
* **Simulated Checkout Flow**: Full checkout forms with card information simulation and successful transaction celebration animations powered by `canvas-confetti`.
* **Admin dashboard**:
  * Tabbed control interface with analytics cards (Total Sales, Orders, Products, Pending tracker).
  * Product inventory CRUD controls (Create product, edit descriptions, adjust prices/stock, upload images, delete).
  * Customer orders tracker with order status modifier toggle dropdowns (Pending, Processing, Shipped, Delivered, Cancelled).
* **Responsive Layouts**: Designed for visual excellence across desktop, tablet, and mobile screens.

---

## 📁 Repository Structure

```text
HorizonTechX_ECommerce/
├── backend/
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, profile logic
│   │   ├── productController.js# Product listing, detail queries, Admin CRUD
│   │   └── orderController.js  # Add order, view order histories, update status
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & admin guard middlewares
│   │   └── errorMiddleware.js  # 404 router and exception catcher
│   ├── models/
│   │   ├── User.js             # Mongoose User Schema (hashing, check methods)
│   │   ├── Product.js          # Mongoose Product Schema
│   │   └── Order.js            # Mongoose Order Schema
│   ├── routes/
│   │   ├── authRoutes.js       # Register, login, and profile route map
│   │   ├── productRoutes.js    # Product browsing and Admin CRUD routes
│   │   └── orderRoutes.js      # Cart submissions & Admin tracking routes
│   ├── .env                    # Port, Mongo URI, Secrets
│   ├── package.json            # Node backend script and packages
│   ├── seeder.js               # Initial tech database seed population script
│   └── server.js               # Main Express app setup
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminRoute.jsx  # Admin route wrapper check
    │   │   ├── ProtectedRoute.jsx # Logged-in client route wrapper check
    │   │   ├── Navbar.jsx      # Navigation header with search and badge
    │   │   ├── Footer.jsx      # Footer layout with category/newsletter links
    │   │   ├── ProductCard.jsx # Grid catalog item card
    │   │   └── Spinner.jsx     # Full-page / segment loader indicators
    │   ├── context/
    │   │   ├── AuthContext.jsx # Auth Context state and Axios integrations
    │   │   └── CartContext.jsx # LocalStorage-backed cart state
    │   ├── pages/
    │   │   ├── Home.jsx        # Hero, categories list, and featured list
    │   │   ├── Products.jsx    # Complete product listings catalog with filters
    │   │   ├── ProductDetails.jsx # Item descriptions, stock warnings, and Qty
    │   │   ├── Cart.jsx        # Shopping cart subtotal breakdown list
    │   │   ├── Checkout.jsx    # Simulated shipping and credit card page
    │   │   ├── Orders.jsx      # Historical order lookup page
    │   │   ├── Login.jsx       # Auth Sign In panel
    │   │   └── Register.jsx    # Auth Sign Up panel
    │   ├── App.jsx             # React Router links and contexts mappings
    │   ├── index.css           # Custom scrollbars, glass panels, animations
    │   └── main.jsx            # DOM mounting root script
    ├── package.json            # React & Vite packaging config
    ├── tailwind.config.js      # Content mappings & custom Outfit font extensions
    ├── postcss.config.js       # PostCSS Tailwind builder plugin config
    └── vite.config.js          # Vite config containing backend relative proxy config
```

---

## 🛠️ Setup & Running Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (either running locally or a MongoDB Atlas cluster URL)

### 1. Configure the Backend Environment
1. Navigate to the `backend/` directory.
2. In the `.env` file, configure the connection URI:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/horizontechx  # Fallback to local or insert MongoDB Atlas string
   JWT_SECRET=supersecretjwtkeyhorizontechx123!
   NODE_ENV=development
   ```

### 2. Install Dependencies
Run this in the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Seed Product Database
Populate the database with sample products and default user/admin testing accounts:
```bash
cd backend
npm run seed
```

> **Note**: This creates two testing accounts:
> * **Standard User**:
>   * Email: `user@horizontechx.com`
>   * Password: `userpassword123`
> * **Administrator**:
>   * Email: `admin@horizontechx.com`
>   * Password: `adminpassword123`

### 4. Run the Project Locally
You will need to open two terminal windows:

#### Terminal 1: Start Backend Express API
```bash
cd backend
npm run dev
```
Starts backend API on `http://localhost:5000`.

#### Terminal 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Starts frontend interface on `http://localhost:3000`. Vite automatically proxies any `/api/*` endpoints to the backend on port 5000.

---

## 🔒 Security Mappings (REST Endpoints)

| Method | Endpoint | Description | Protected | Admin Only |
| :--- | :--- | :--- | :---: | :---: |
| **POST** | `/api/auth/register` | Register a new user | No | No |
| **POST** | `/api/auth/login` | Login user, return JWT token | No | No |
| **GET** | `/api/auth/profile` | Get active user credentials profile | **Yes** | No |
| **GET** | `/api/products` | Get list of all products with search & category filters | No | No |
| **GET** | `/api/products/:id` | Get single product detail | No | No |
| **POST** | `/api/products` | Create a product entry | **Yes** | **Yes** |
| **PUT** | `/api/products/:id` | Update product details or stock | **Yes** | **Yes** |
| **DELETE** | `/api/products/:id` | Remove product entry | **Yes** | **Yes** |
| **POST** | `/api/orders` | Submit cart items & shipping details | **Yes** | No |
| **GET** | `/api/orders/myorders`| Get list of active client's purchases | **Yes** | No |
| **GET** | `/api/orders` | View all customer orders | **Yes** | **Yes** |
| **PUT** | `/api/orders/:id/status`| Adjust order shipping status | **Yes** | **Yes** |
