# 🌱 AgriNuel - Agricultural Marketplace Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Connecting Nigerian farmers directly with buyers, eliminating middlemen and maximizing profits through technology.

## 📋 Table of Contents

- [🌟 Problem Statement](#-problem-statement)
- [💡 Solution](#-solution)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🔧 API Endpoints](#-api-endpoints)
- [🎨 UI Components](#-ui-components)
- [🔐 Authentication](#-authentication)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Problem Statement

### The Nigerian Agricultural Challenge

Nigeria's agricultural sector faces significant challenges that hinder growth and efficiency:

- **Middleman Exploitation**: Farmers receive only 30-40% of the final consumer price due to multiple intermediaries
- **Price Opacity**: Lack of transparent pricing information leads to unfair negotiations
- **Logistics Inefficiencies**: Poor transportation and delivery systems increase costs and waste
- **Limited Market Access**: Smallholder farmers struggle to reach urban markets and large buyers
- **Information Asymmetry**: Farmers lack real-time market data and buyer requirements
- **Post-Harvest Losses**: Inadequate storage and logistics result in 40% of produce being wasted

### Economic Impact

- **Farmer Income**: Average farmer earns ₦50,000-₦150,000 annually vs. potential ₦300,000+
- **Food Prices**: Consumers pay 2-3x the farm-gate price
- **GDP Contribution**: Agriculture contributes only 23% to GDP despite employing 70% of the workforce
- **Youth Migration**: Lack of profitability drives rural-urban migration

## 💡 Solution

### AgriNuel: Direct Farm-to-Consumer Marketplace

AgriNuel revolutionizes Nigeria's agricultural value chain by creating a digital marketplace that:

- **Eliminates Middlemen**: Direct farmer-buyer connections
- **Provides Price Transparency**: Real-time pricing data and analytics
- **Optimizes Logistics**: Integrated delivery tracking and route optimization
- **Ensures Quality**: Standardized grading and verification systems
- **Builds Trust**: Review systems and secure payment processing

### Key Innovations

1. **Direct Trading Platform**: Farmers list products, buyers place orders directly
2. **Real-time Price Tracking**: Live market data from multiple sources
3. **Integrated Logistics**: Partnered delivery services with tracking
4. **Quality Assurance**: Standardized grading and certification
5. **Community Building**: Farmer cooperatives and buyer networks

## ✨ Features

### 🧑‍🌾 For Farmers
- **Product Listing**: Easy upload with photos and detailed descriptions
- **Price Optimization**: Real-time market data and pricing recommendations
- **Order Management**: Track orders from placement to delivery
- **Payment Security**: Secure payment processing with instant settlements
- **Logistics Support**: Integrated delivery tracking and route optimization
- **Community Access**: Connect with other farmers and cooperatives

### 🛒 For Buyers
- **Direct Sourcing**: Purchase directly from verified farmers
- **Quality Assurance**: View product grades, certifications, and farmer ratings
- **Bulk Ordering**: Place large orders with negotiated pricing
- **Delivery Tracking**: Real-time updates on order status and delivery
- **Price Comparison**: Compare prices across farmers and regions
- **Scheduled Delivery**: Plan deliveries for specific dates and times

### 🏢 For Cooperatives & Businesses
- **Bulk Procurement**: Source large quantities for processing/distribution
- **Supplier Networks**: Build relationships with verified farmer groups
- **Quality Standards**: Access certified organic and premium products
- **Logistics Management**: Coordinate multi-supplier deliveries
- **Analytics Dashboard**: Market trends and procurement insights

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **State Management**: React Hooks + Context
- **Icons**: Lucide React

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development Tools
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky
- **Environment**: Node.js 18+

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase Cloud
- **CDN**: Cloudflare
- **Monitoring**: Vercel Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adenueltech/agrinuel.git
   cd agrinuel
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   Run the SQL scripts in `scripts/` directory in order:
   ```sql
   -- Run in Supabase SQL Editor
   -- 01-create-tables.sql
   -- 02-seed-data.sql
   -- 03-update-market-prices.sql
   -- 04-seed-logistics-data.sql
   -- 05-seed-chat-data.sql
   ```

5. **Storage Setup**
   Create these buckets in Supabase Storage:
   - `product-images` (public)
   - `profile-images` (public)

6. **Start Development Server**
   ```bash
   pnpm dev
   ```

7. **Open Browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
agrinuel/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── dashboard/                # Main dashboard
│   ├── profile/                  # User profiles
│   ├── contact/                  # Contact page
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── landing/                  # Landing page sections
│   ├── marketplace/              # Product/marketplace components
│   ├── dashboard/                # Dashboard components
│   ├── auth/                     # Authentication components
│   └── logistics/                # Logistics components
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase configuration
│   └── utils.ts                  # Helper functions
├── scripts/                      # Database scripts
├── public/                       # Static assets
└── types/                        # TypeScript definitions
```

## 🗄️ Database Schema

### Core Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('farmer', 'buyer')),
  profile_image_url TEXT,
  bio TEXT,
  location JSONB,
  farm_size TEXT,
  experience_years INTEGER,
  specializations TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price_per_unit DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  quantity_available INTEGER NOT NULL,
  harvest_date DATE,
  quality_grade TEXT,
  organic BOOLEAN DEFAULT false,
  location JSONB,
  images TEXT[],
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id),
  farmer_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  delivery_address JSONB,
  delivery_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `deliveries`
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  driver_name TEXT,
  driver_phone TEXT,
  vehicle_info JSONB,
  pickup_location JSONB,
  delivery_location JSONB,
  estimated_distance DECIMAL,
  estimated_duration INTEGER,
  status TEXT DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Products
- `GET /api/products` - List products with filters
- `POST /api/products` - Create new product (farmers only)
- `PUT /api/products/[id]` - Update product (owner only)
- `DELETE /api/products/[id]` - Delete product (owner only)

### Orders
- `GET /api/orders` - User's orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status

### Analytics
- `GET /api/analytics/prices` - Market price data
- `GET /api/analytics/dashboard` - User dashboard stats

## 🎨 UI Components

### Landing Page
- **Hero Section**: Animated carousel with call-to-action
- **Features Section**: Key platform benefits
- **Pricing Section**: Subscription plans
- **Testimonials**: User success stories
- **Contact Section**: Contact form and information

### Dashboard
- **Marketplace**: Product browsing and search
- **My Products**: Farmer's product management
- **Analytics**: Price tracking and insights
- **Logistics**: Delivery tracking and optimization
- **Messages**: Real-time chat system

### Authentication
- **Sign Up/In Forms**: Multi-step registration
- **Email Verification**: Account activation flow
- **Password Reset**: Secure password recovery

## 🔐 Authentication

### Supabase Auth Integration

- **Email/Password**: Standard authentication
- **Social Login**: Google, Facebook (optional)
- **Email Verification**: Account activation
- **Password Reset**: Secure recovery flow
- **Session Management**: Automatic token refresh

### User Roles

- **Farmers**: Product listing, order management, analytics
- **Buyers**: Product browsing, ordering, delivery tracking
- **Admins**: Platform management (future feature)

## 📦 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Connect to Vercel
   vercel --prod
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Database Connection**
   Ensure Supabase allows Vercel IP addresses

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Storage buckets created and configured
- [ ] Email templates configured
- [ ] Domain SSL certificate
- [ ] Analytics and monitoring set up

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and test**
4. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Create Pull Request**

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase Team**: For the amazing backend-as-a-service platform
- **Next.js Team**: For the incredible React framework
- **Vercel**: For seamless deployment and hosting
- **Nigerian Farmers**: For inspiring this solution
- **Open Source Community**: For the tools and libraries

## 📞 Support

- **Email**: support@agrinuel.com
- **Issues**: [GitHub Issues](https://github.com/adenueltech/agrinuel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/adenueltech/agrinuel/discussions)

---

**Built with ❤️ for Nigerian farmers and buyers**

*Transforming agriculture through technology - one connection at a time.*
