# EventNest - Event Ticketing Platform

A production-ready event ticketing web platform similar to Eventbrite, with full PayPal integration and AWS hosting capabilities. EventNest makes event discovery and ticketing seamless and accessible.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Redux (state management)
- Axios (API requests)

### Backend
- Node.js
- Express.js
- PostgreSQL (AWS RDS)
- JWT Authentication
- PayPal API Integration

### Infrastructure
- AWS EC2 (hosting)
- AWS RDS (database)
- AWS S3 (file storage)
- AWS SES (email notifications)
- Docker
- GitHub Actions (CI/CD)

## Features

### Event Management
- Create, edit, delete events (organizer dashboard)
- Event fields: title, description, location, date/time, price, available tickets, categories

### Ticket Sales
- Event listing page (searchable and filterable)
- Event detail page with "Buy Ticket" button
- Checkout flow using PayPal
- Order history page for users

### Digital Tickets
- QR code generation for each purchased ticket
- Admin QR code scanner for ticket validation

### Notifications
- Email confirmation after purchase
- Event reminder emails

### Admin Panel
- View/manage all events
- View ticket sales reports

### User Dashboard
- Personalized welcome message
- Event creation statistics
- Ticket sales metrics
- Total earnings summary

### Support & About Pages
- Company information and mission
- Contact form with AWS SES integration
- Frequently asked questions
- Manage users

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Docker (for containerization)
- AWS account (for deployment)
- PayPal Developer account

### Installation

1. Clone the repository
```
git clone <repository-url>
cd event-ticketing-platform
```

2. Install frontend dependencies
```
cd frontend
npm install
```

3. Install backend dependencies
```
cd ../backend
npm install
```

4. Set up environment variables
   - Create `.env` files in both frontend and backend directories
   - See `.env.example` files for required variables

5. Start development servers
```
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## Deployment

EventNest is configured for flexible deployment options to suit different hosting needs.

### Option 1: AWS with Docker and GitHub Actions

1. **Prerequisites**:
   - AWS account with appropriate permissions
   - Domain name registered and configured
   - GitHub repository with the EventNest codebase

2. **Setup Steps**:
   - Configure AWS services (EC2, RDS, S3, SES)
   - Set up GitHub Actions secrets for CI/CD
   - Push code to trigger automatic deployment

3. **Configuration Files**:
   - `docker-compose.yml` - Container orchestration
   - `.github/workflows/deploy.yml` - CI/CD pipeline
   - `backend/Dockerfile` and `frontend/Dockerfile` - Container definitions

Detailed AWS deployment instructions are available in `DEPLOYMENT_GUIDE.md`.

### Option 2: Plesk on AWS

1. **Prerequisites**:
   - AWS account
   - Plesk license (or trial)
   - Domain name

2. **Setup Steps**:
   - Launch EC2 instance with Plesk from AWS Marketplace
   - Configure domain and SSL in Plesk
   - Deploy application using Plesk's Docker integration

See `PLESK_DEPLOYMENT.md` for step-by-step instructions.

## Security

- HTTPS across the platform
- JWT authentication for API routes
- Input sanitization to prevent XSS/SQL Injection
- Secure environment variables using AWS Secrets Manager

## License

[MIT](LICENSE)
