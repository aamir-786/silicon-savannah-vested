# Silicon Savannah Vested - Fractional Real Estate Investment Platform

A production-ready MVP platform that enables U.S. investors to purchase fractional equity in Kenyan real estate. Built with Next.js, TypeScript, and integrated with industry-leading compliance and payment providers.

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Compliance**: North Capital TransactAPI (SEC-compliant)
- **Payments**: Dwolla (ACH transfers & escrow)
- **Bank Linking**: Plaid
- **E-Signatures**: DocuSign
- **Deployment**: Vercel (recommended)

## ✨ Features

### User Roles
- **Guest**: Browse properties (read-only)
- **Investor (Unverified)**: Registered but pending KYC
- **Investor (Verified)**: KYC approved, can invest
- **Admin**: Full platform management

### Core Functionality
- 🏠 **Property Marketplace**: Browse and view detailed property listings
- 💰 **Investment Engine**: Complete investment flow with document signing
- 🔐 **KYC/AML Workflow**: North Capital integration for compliance
- 🏦 **Bank Linking**: Secure account connection via Plaid
- 📊 **Investor Dashboard**: Portfolio tracking and performance
- 💳 **Secure Payments**: Dwolla-powered ACH transfers
- 📄 **Document Management**: DocuSign integration for legal agreements
- 💵 **Dividend Distribution**: Automated quarterly payments
- 👨‍💼 **Admin Panel**: Property, user, and dividend management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Accounts with:
  - Clerk (authentication)
  - North Capital (compliance)
  - Dwolla (payments)
  - Plaid (bank linking)
  - DocuSign (e-signatures)

### Installation

1. **Clone and navigate to the project**:
```bash
cd d:\Fiverr\Silicon\silicon-savannah-vested
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env.local` file based on `env.example.txt`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/silicon_savannah_vested"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# North Capital
NORTH_CAPITAL_API_KEY=your_api_key
NORTH_CAPITAL_API_URL=https://api-sandboxdash.norcapsecurities.com
NORTH_CAPITAL_CLIENT_ID=your_client_id

# Dwolla
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret
DWOLLA_ENVIRONMENT=sandbox

# Plaid
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# DocuSign
DOCUSIGN_INTEGRATION_KEY=your_integration_key
DOCUSIGN_USER_ID=your_user_id
DOCUSIGN_ACCOUNT_ID=your_account_id
DOCUSIGN_PRIVATE_KEY=your_base64_encoded_private_key

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Initialize the database**:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Run the development server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
silicon-savannah-vested/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── (admin)/            # Admin panel routes
│   ├── api/                 # API endpoints
│   ├── globals.css          # Global styles & design system
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── auth/                # Authentication components
│   ├── property/            # Property-related components
│   ├── investment/          # Investment flow components
│   ├── dashboard/           # Dashboard components
│   └── admin/               # Admin panel components
├── lib/
│   ├── integrations/        # Third-party service integrations
│   │   ├── north-capital.ts # North Capital API
│   │   ├── dwolla.ts        # Dwolla payments
│   │   ├── plaid.ts         # Plaid bank linking
│   │   └── docusign.ts     # DocuSign e-signatures
│   ├── db.ts                # Prisma client
│   ├── utils.ts             # Utility functions
│   ├── encryption.ts        # Data encryption utilities
│   ├── permissions.ts       # Role-based access control
│   └── validations.ts       # Zod schemas
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── .agent/workflows/        # Implementation plans
```

## 🎨 Design System

The application features a premium design system with:
- **Vibrant color palette** with HSL-based theming
- **Glassmorphism effects** for modern UI
- **Smooth animations** and micro-interactions
- **Dark mode support** with automatic switching
- **Premium gradients** and glow effects
- **Custom scrollbar** styling
- **Typography** using Inter and Poppins fonts

### Key CSS Classes
- `.premium-card`: Card with hover effects and shadows
- `.glass`: Glassmorphism effect
- `.gradient-text`: Gradient text effect
- `.btn-premium`: Premium gradient button
- `.bg-mesh`: Mesh gradient background
- `.animate-float`, `.animate-slide-up`: Smooth animations

## 🔐 Security Features

- **Data Encryption**: SSN and sensitive data encrypted at rest
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Zod schemas for all forms
- **Audit Logging**: Complete audit trail for all actions
- **No Direct Storage**: Bank details and SSN handled via third parties
- **Environment Variables**: All secrets in environment variables
- **HTTPS Only**: Production deployment requires HTTPS

## 🔄 Investment Flow

1. **User Registration**: Sign up with Clerk
2. **KYC Submission**: Complete identity verification
3. **KYC Approval**: North Capital processes verification
4. **Browse Properties**: View available investments
5. **Select Investment**: Choose shares/amount
6. **Document Signing**: DocuSign embedded signing
7. **Bank Selection**: Link account via Plaid
8. **Payment**: Dwolla processes ACH transfer
9. **Confirmation**: Investment recorded and shares allocated

## 📊 Database Schema

### Key Models
- **User**: User accounts with role and KYC status
- **KYCData**: Identity verification information
- **Property**: Real estate listings
- **Investment**: User investments in properties
- **Transaction**: Financial transaction history
- **BankAccount**: Linked bank accounts (Plaid/Dwolla)
- **Document**: Signed agreements and tax forms
- **Dividend**: Quarterly dividend distributions
- **AuditLog**: Complete audit trail

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Run database migrations
npx prisma generate  # Generate Prisma Client
```

## 📝 API Endpoints

### Authentication
- Handled by Clerk middleware

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/[id]` - Get property details
- `POST /api/properties` - Create property (Admin)
- `PUT /api/properties/[id]` - Update property (Admin)

### Investments
- `POST /api/investments/initiate` - Start investment
- `POST /api/investments/sign` - Sign documents
- `POST /api/investments/confirm` - Confirm investment

### KYC
- `POST /api/kyc/submit` - Submit KYC data
- `GET /api/kyc/status` - Check KYC status
- `POST /api/kyc/webhook` - North Capital webhook

### Dashboard
- `GET /api/dashboard/portfolio` - Portfolio summary
- `GET /api/dashboard/transactions` - Transaction history
- `GET /api/dashboard/documents` - User documents

### Admin
- `GET /api/admin/users` - List users
- `PUT /api/admin/kyc/[id]/approve` - Approve KYC
- `POST /api/admin/dividends/distribute` - Distribute dividends

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel**:
- Import project from GitHub
- Add environment variables
- Deploy

3. **Database**: Use Neon or Supabase for PostgreSQL

### Environment Setup
- Set all environment variables in Vercel dashboard
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Configure webhooks for third-party services
- Run migrations in production

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] KYC submission and approval
- [ ] Property browsing
- [ ] Complete investment flow
- [ ] Bank account linking
- [ ] Document signing
- [ ] Dividend distribution
- [ ] Admin panel functions

## 📚 Third-Party Integration Setup

### North Capital
1. Create developer account
2. Obtain sandbox API keys
3. Configure webhook endpoints
4. Test KYC and investment flows

### Dwolla
1. Create sandbox account
2. Get API credentials
3. Configure webhook URL
4. Test transfers and mass payments

### Plaid
1. Create developer account
2. Get sandbox credentials
3. Test Link flow
4. Generate processor tokens for Dwolla

### DocuSign
1. Create developer account
2. Generate integration key
3. Set up RSA keypair
4. Configure redirect URLs

## 🔧 Configuration

### Clerk Setup
1. Create application
2. Configure sign-in/sign-up pages
3. Add user metadata for roles
4. Set up webhooks for user creation

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🆘 Troubleshooting

### Common Issues

**Prisma Client Not Found**:
```bash
npx prisma generate
```

**Database Connection Error**:
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify database exists

**Clerk Authentication Issues**:
- Verify API keys are correct
- Check redirect URLs match
- Ensure middleware is configured

**Third-Party API Errors**:
- Check API keys and secrets
- Verify sandbox vs production environment
- Review API documentation for changes

## 📈 Performance Optimization

- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Database query optimization with Prisma
- Caching strategies for property listings
- CDN for static assets

## 🔒 Compliance Notes

- Platform is designed for SEC Regulation A+ offerings
- North Capital handles broker-dealer requirements
- Proper disclosures required on all property listings
- K-1 tax forms generated for investors
- Annual audits recommended

## 🤝 Contributing

This is a production MVP. For any issues or enhancements:
1. Document the issue/feature
2. Test thoroughly in sandbox environment
3. Update documentation
4. Submit for review

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For technical support or questions:
- Email: support@siliconsavannahvested.com
- Documentation: See implementation-plan.md

---

**Built with ❤️ for the future of global real estate investment**
