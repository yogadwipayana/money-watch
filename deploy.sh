#!/bin/bash

# Deployment script for Money Watch with SSL
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Money Watch deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "example.com" ]; then
    echo "❌ Error: DOMAIN not configured in .env"
    exit 1
fi

if [ -z "$SSL_EMAIL" ] || [ "$SSL_EMAIL" = "admin@example.com" ]; then
    echo "❌ Error: SSL_EMAIL not configured in .env"
    exit 1
fi

echo "📋 Configuration:"
echo "  Domain: $DOMAIN"
echo "  Email: $SSL_EMAIL"
echo "  API URL: $API_URL"

# Update nginx.conf with domain
echo "🔧 Updating nginx configuration..."
sed -i.bak "s/yourdomain.com/$DOMAIN/g" nginx.conf
echo "✅ Nginx configuration updated"

# Check if SSL certificate already exists
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "🔒 SSL certificate already exists, skipping initialization"
    SKIP_SSL=true
else
    echo "🔒 SSL certificate not found, will initialize"
    SKIP_SSL=false
fi

# Build and start services
echo "🐳 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Initialize SSL if needed
if [ "$SKIP_SSL" = false ]; then
    echo "🔐 Initializing SSL certificate..."
    chmod +x init-letsencrypt.sh
    ./init-letsencrypt.sh "$DOMAIN" "$SSL_EMAIL"
else
    echo "♻️  Reloading nginx..."
    docker-compose exec nginx nginx -s reload
fi

# Show status
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "🌐 Your site should be available at:"
echo "   https://$DOMAIN"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart:       docker-compose restart"
echo "   SSL status:    docker-compose run --rm certbot certificates"
