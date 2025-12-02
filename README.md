# Money Watch

A modern web application for tracking and managing your investment portfolio across multiple broker accounts. Built with Astro and Tailwind CSS.

## About

Money Watch is a financial portfolio management application that helps you monitor your investments across different brokers in one centralized dashboard. Track your cash balance, invested amounts, and total equity for each broker account with a clean and intuitive interface.

## Features

- **Multi-Broker Support**: Manage multiple broker accounts in one place
- **Real-time Portfolio Tracking**: Monitor cash balance, invested amounts, and total equity
- **Transaction Management**: Add and track transactions for each broker
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Indonesian Rupiah Format**: Built-in currency formatting for IDR

## Tech Stack

- **Framework**: [Astro 5.14](https://astro.build) - SSR-enabled web framework
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com) - Utility-first CSS framework
- **Runtime**: Node.js 20+ with standalone adapter
- **Language**: TypeScript
- **Containerization**: Docker support

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized deployment)

## Installation

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Money Watch/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your API URL:
   ```env
   API_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:4321`

### Docker Installation

1. **Build the Docker image**
   ```bash
   docker build -t money-watch .
   ```

2. **Run the container**
   ```bash
   docker run -p 4321:4321 -e API_URL=http://your-api-url money-watch
   ```

   Or using docker-compose (create a `docker-compose.yml` file):
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "4321:4321"
       environment:
         - API_URL=http://your-api-url
       restart: unless-stopped
   ```

   Then run:
   ```bash
   docker-compose up -d
   ```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_URL` | Backend API endpoint URL | - | Yes |

### Build Configuration

The application uses Astro with the Node.js adapter in standalone mode. Configuration can be modified in `astro.config.mjs`.

## Available Commands

All commands should be run from the project root directory:

| Command | Action |
|---------|--------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   │   ├── broker/      # Broker-specific components
│   │   └── card.astro   # Card component
│   ├── layouts/         # Layout components
│   │   ├── broker/      # Broker-specific layouts
│   │   ├── layout.astro # Base layout
│   │   ├── navbar.astro # Navigation bar
│   │   └── cardGroups.astro # Card grid layout
│   ├── pages/           # Application routes
│   │   ├── index.astro  # Home page
│   │   ├── login.astro  # Login page
│   │   ├── register.astro # Registration page
│   │   ├── dashboard.astro # Main dashboard
│   │   └── dashboard/   # Dynamic broker pages
│   └── utils/           # Utility functions
│       └── auth.js      # Authentication helpers
├── astro.config.mjs     # Astro configuration
├── Dockerfile           # Docker configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Usage

### Creating an Account

1. Navigate to `/register`
2. Fill in your registration details
3. Submit the form to create your account

### Adding a Broker

1. Log in to your account
2. Go to the dashboard
3. Click on the add broker button
4. Enter broker name and initial cash balance
5. Submit to add the broker to your portfolio

### Viewing Portfolio

The dashboard displays all your broker accounts with:
- Broker name
- Cash balance
- Invested amount
- Total equity (cash + invested)

### Managing Transactions

Navigate to individual broker pages at `/dashboard/[broker-name]` to view and add transactions.

## Development

### Code Quality

The project uses TypeScript for type safety. Run type checking with:
```bash
npm run astro check
```

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The output will be in the `./dist/` directory

3. Preview the production build:
   ```bash
   npm run preview
   ```

## Deployment

### Traditional Deployment

1. Build the application
2. Deploy the `dist` folder to your Node.js hosting provider
3. Ensure Node.js 20+ is available
4. Set the `API_URL` environment variable
5. Run the server: `node ./dist/server/entry.mjs`

### Docker Deployment

The included Dockerfile uses a multi-stage build for optimized production images:

- Stage 1: Build the application
- Stage 2: Create minimal runtime image with production dependencies only

The container exposes port 4321 and runs in production mode.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Specify your license here]

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
