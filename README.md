# Second-Hand Marketplace Platform

**A complete e-commerce solution for buying and selling pre-owned items online**

This platform enables you to launch your own second-hand marketplace business with built-in customer and admin functionality. Everything from product listings to order management is ready to deploy.

---

## 🎯 What This Platform Does

**For Your Customers:**
- Browse and search products by category, price range, size, and gender
- Add items to cart and complete purchases securely
- Track their order history and delivery status
- Create accounts and manage their profile

**For Your Business:**
- Manage product inventory (add, edit, delete listings)
- Upload product images
- Process and track customer orders
- Organize products by categories
- Access a dedicated admin dashboard

---

## 🛠️ Technology Stack

**Backend (Server-side):**
- ASP.NET Core 8.0 Web API
- MySQL Database
- Entity Framework Core for data management
- JWT token-based security

**Frontend (User Interface):**
- Angular 17+ framework
- TypeScript
- Bootstrap 5 for responsive design
- Works seamlessly on desktop and mobile

**Architecture:**
- RESTful API design
- Secure authentication system
- Transaction-safe checkout process
- Comprehensive error handling

---

## ✨ Core Features

### Customer Portal
✅ User registration and login  
✅ Product catalog with advanced filtering  
✅ Shopping cart with real-time availability  
✅ Secure checkout process  
✅ Order history and tracking  
✅ Product search by multiple criteria  

### Admin Dashboard
✅ Product management (CRUD operations)  
✅ Image upload and management  
✅ Order oversight and processing  
✅ Category management  
✅ Real-time inventory control  
✅ Role-based access control  

### Technical Capabilities
✅ Prevents duplicate purchases (race condition handling)  
✅ Automatic data seeding for quick setup  
✅ API documentation with Swagger  
✅ Unit test coverage  
✅ Scalable architecture  

---

## 📸 Screenshots

> **Coming Soon**: Screenshots of the customer storefront, admin dashboard, and key workflows will be added here.

Planned screenshots:
- Homepage and product catalog
- Product detail page
- Shopping cart
- Admin dashboard
- Order management interface

---

## 🚀 Running the Platform Locally

### Prerequisites

Before you begin, ensure you have:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download) installed
- [Node.js 18+](https://nodejs.org/) and npm installed
- [MySQL 8.0+](https://dev.mysql.com/downloads/) running locally
- A code editor (VS Code, Visual Studio, etc.)

### Step-by-Step Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/nguyenthan2308/Second_Hand_System.git
cd Second_Hand_System
```

#### 2️⃣ Configure Database Connection

Create a file named `appsettings.json` in the project root by copying the example:

```bash
# Copy the template
cp appsettings.Example.json appsettings.json
```

Open `appsettings.json` and update your database credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SecondHandDB;User=root;Password=YOUR_PASSWORD_HERE;"
  },
  "Jwt": {
    "Key": "YourSecretKeyHere-MinimumLength32Characters",
    "Issuer": "SecondHandSystem",
    "Audience": "SecondHandUsers"
  }
}
```

**Important**: Replace `YOUR_PASSWORD_HERE` with your actual MySQL password.

#### 3️⃣ Initialize the Database

Run these commands to create the database and populate it with sample data:

```bash
dotnet ef database update
```

This will:
- Create all necessary database tables
- Add default admin and customer accounts
- Insert sample categories and products

#### 4️⃣ Start the Backend Server

```bash
dotnet run
```

✅ Backend will start at: **http://localhost:5000**  
✅ API documentation available at: **http://localhost:5000/swagger**

#### 5️⃣ Start the Frontend Application

Open a **new terminal window** and run:

```bash
cd frontend
npm install
npm start
```

✅ Frontend will start at: **http://localhost:4200**

#### 6️⃣ Access the Platform

**Customer Interface:**  
Open your browser to: **http://localhost:4200**

**API Documentation:**  
View all endpoints at: **http://localhost:5000/swagger**

### Test Accounts

After setup, you can login with these pre-configured accounts:

**Admin Access:**
- Username: `admin`
- Password: `Admin@123`

**Customer Access:**
- Username: `customer1`
- Password: `Customer@123`

---

## 🌐 Live Demo

> **🚀 The platform is now live!**

- **Customer Storefront & Admin Dashboard:** [https://second-hand-system.vercel.app/](https://second-hand-system.vercel.app/)
- **Backend API (Swagger):** [https://second-hand-system.onrender.com/swagger](https://second-hand-system.onrender.com/swagger)

*Note: The backend is hosted on Render's free tier, so it may take 30-50 seconds to spin up on the first request if it has been idle.*

**Test Accounts:**
- **Admin**: `admin` / `Admin@123`
- **Customer**: `customer` / `Customer@123`

---

## 💼 For Clients & Partners

### Customization Options

This platform is designed to be easily customizable for your specific business needs:

**✏️ Branding & Design**
- Update colors, logos, and fonts to match your brand
- Modify layout and user interface components
- Add custom pages and sections

**🔧 Feature Additions**
- Payment gateway integration (Stripe, PayPal, etc.)
- Email notifications for orders
- Advanced reporting and analytics
- Product reviews and ratings
- Wishlist functionality
- Multi-language support

**📈 Scalability**
- Database optimization for high traffic
- Caching implementation
- Load balancing setup
- Multi-server deployment

### Extension Services Available

I offer professional services to extend this platform:

- ✅ **Custom Feature Development** - Add any functionality you need
- ✅ **API Integration** - Connect to payment gateways, shipping providers, etc.
- ✅ **Mobile App Development** - iOS and Android companion apps
- ✅ **Deployment & Hosting** - Complete cloud setup and configuration
- ✅ **Training & Documentation** - Team training and operational guides
- ✅ **Maintenance & Support** - Ongoing updates and bug fixes

### Maintenance & Support

**What's Included:**
- Clean, well-documented codebase
- Comprehensive unit tests
- API documentation
- Setup guide (see [SETUP.md](SETUP.md))

**Available for Hire:**
- Bug fixes and issue resolution
- Feature enhancements
- Performance optimization
- Security updates
- Database migrations
- Technical consulting

---

## 📞 Contact

**Available for freelance projects and custom development**

- **GitHub**: [@nguyenthan2308](https://github.com/nguyenthan2308)
- **Email**: Available upon request
- **Portfolio**: More projects available on GitHub

**Services Offered:**
- Full-stack web application development
- E-commerce platform customization
- API development and integration
- Cloud deployment and DevOps
- Long-term maintenance contracts

---

## 📋 Technical Details

**For Developers:**
- Full source code with MIT license
- RESTful API with Swagger documentation
- Repository pattern implementation
- JWT authentication with role-based authorization
- Entity Framework Core migrations
- Angular standalone components
- RxJS for state management
- Bootstrap 5 responsive design

**Quality Assurance:**
- xUnit test coverage
- Transaction-safe operations
- CORS configuration
- Input validation
- Error handling middleware

---

## 📄 License

This project is licensed under the MIT License - free to use for commercial purposes with attribution.

---

**Last Updated:** February 2026  
**Status:** Production Ready  
**Support:** Available for custom projects

⭐ **Interested in similar work?** Star this repository and feel free to reach out for collaborations!
