# Intare Pharmacy Management System

A modern, full-stack pharmacy inventory management system with React.js frontend and Node.js backend. This application provides a comprehensive solution for managing medicines, pharmacists, customer orders, and appointments.

## 🌐 Live Demo

- **Frontend**: [https://intarepharmacy02.netlify.app](https://intarepharmacy02.netlify.app)
- **Backend API**: Hosted on Render

## 🏗️ Architecture

### Frontend (React.js)
- **Deployment**: Netlify
- **Location**: `/pharmacy-frontend`
- **Build**: `npm run build`

### Backend (Node.js/Express)
- **Deployment**: Render
- **Location**: `/pharmacy-backend`
- **Database**: MongoDB Atlas
- **Email Service**: Brevo API

## Features

### 🏠 Home Page
- Display all available medicines in an attractive card layout
- Information about the pharmacy
- Purchase functionality for customers
- Stock status indicators

### 👤 Authentication
- Role-based login system (Admin & Pharmacist)
- JWT-based secure authentication
- Protected routes

### 👨💼 Admin Dashboard
- **Pharmacist Management**: Full CRUD operations
  - Create new pharmacists
  - View all pharmacists
  - Edit pharmacist details
  - Delete pharmacists
- Stock alerts for low inventory medicines

### 💊 Pharmacist Dashboard
- **Medicine Management**: Full CRUD operations
  - Add new medicines
  - View all medicines with details
  - Edit medicine information
  - Delete medicines
  - Update stock levels
- View recent customer orders
- Stock alerts for low inventory

### 🛒 Purchase System
- Customers can purchase medicines directly from the home page
- Collects customer information for delivery:
  - Full name
  - Email address
  - Phone number
  - Delivery address
  - Quantity selection
- Automatic stock deduction upon purchase
- Email confirmation via Brevo

### 📅 Appointment Booking
- Schedule consultations with experienced pharmacists
- Multiple consultation types available
- Easy-to-use booking form
- Email notifications

### 📧 Contact System
- Contact form with email integration
- Automatic email responses
- Admin notifications

### ⚠️ Stock Alerts
- Real-time alerts for medicines with low stock (< 20 units)
- Visible to both Admin and Pharmacist
- Prominent display in navigation bar and dashboards

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- MongoDB Atlas account
- Brevo account for email services

### Local Development

#### Backend Setup
```bash
cd pharmacy-backend
npm install

# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# BREVO_API_KEY=your_brevo_api_key
# FROM_EMAIL=your_verified_email
# PORT=5000

npm run dev
```

#### Frontend Setup
```bash
cd pharmacy-frontend
npm install

# Create .env file with:
# REACT_APP_BACKEND_URL=http://localhost:5000

npm start
```

## 🔐 Demo Credentials

### Admin Login
- **Email**: `admin@pharmacy.com`
- **Password**: `compwizard`
- **Access**: Admin Dashboard (Pharmacist CRUD)

### Pharmacist Login
- **Email**: Use any pharmacist email from the list (e.g., `sarah@pharmacy.com`, `michael@pharmacy.com`)
- **Password**: `pharmacist123`
- **Access**: Pharmacist Dashboard (Medicine CRUD)

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **React Router DOM** - Routing and navigation
- **Context API** - State management
- **Lucide React** - Icons
- **FontAwesome** - Additional icons
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Brevo API** - Email service
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Deployment
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Email**: Brevo

## 📁 Project Structure

```
intarepharmacy-v3/
├── pharmacy-frontend/          # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/           # Context providers
│   │   ├── pages/             # Page components
│   │   └── ...
│   └── package.json
├── pharmacy-backend/           # Node.js backend
│   ├── controllers/           # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   └── server.js
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
BREVO_API_KEY=your_brevo_key
FROM_EMAIL=your_email@domain.com
PORT=5000
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

## 🚀 Deployment

### Frontend (Netlify)
1. Connect GitHub repository
2. Set build settings:
   - **Base directory**: `pharmacy-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `pharmacy-frontend/build`
3. Add environment variables in Netlify dashboard
4. Deploy

### Backend (Render)
1. Connect GitHub repository
2. Set build settings:
   - **Root directory**: `pharmacy-backend`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
3. Add environment variables in Render dashboard
4. Deploy

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Admin
- `GET /api/admin/pharmacists` - Get all pharmacists
- `POST /api/admin/pharmacists` - Create pharmacist
- `PUT /api/admin/pharmacists/:id` - Update pharmacist
- `DELETE /api/admin/pharmacists/:id` - Delete pharmacist

### Purchases
- `POST /api/purchases` - Create purchase order
- `GET /api/purchases` - Get all orders

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get all appointments

### Contact
- `POST /api/contact` - Send contact message

## ✨ Key Features

- ✅ Responsive design for all screen sizes
- ✅ Modern UI with smooth animations
- ✅ Real-time stock management
- ✅ Order tracking system
- ✅ Role-based access control
- ✅ JWT authentication
- ✅ Email notifications
- ✅ MongoDB database integration
- ✅ RESTful API design
- ✅ CORS configuration
- ✅ Environment-based configuration
- ✅ Production deployment ready

## 📝 Notes

- Stock alerts trigger when medicine stock is below 20 units
- The system automatically updates stock when orders are placed
- Admin can manage pharmacists, Pharmacists can manage medicines
- All sensitive data is stored securely in environment variables
- Email notifications are sent for purchases and appointments

## 🔮 Future Enhancements

- Advanced reporting and analytics
- Inventory forecasting
- Multi-pharmacy support
- Mobile app development
- Payment gateway integration
- Prescription management
- Supplier management
- Barcode scanning

---

Built with ❤️ using React.js, Node.js, and MongoDB