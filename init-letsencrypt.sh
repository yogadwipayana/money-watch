#!/bin/bash

# Init Let's Encrypt certificates for Nginx
# Usage: ./init-letsencrypt.sh yourdomain.com your@email.com

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./init-letsencrypt.sh <domain> <email>"
    echo "Example: ./init-letsencrypt.sh example.com admin@example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2
STAGING=0 # Set to 1 for testing, 0 for production

echo "### Initializing Let's Encrypt for $DOMAIN"

# Create required directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Download recommended TLS parameters
if [ ! -e "./certbot/conf/options-ssl-nginx.conf" ]; then
    echo "### Downloading recommended TLS parameters ..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/conf/options-ssl-nginx.conf"
fi

if [ ! -e "./certbot/conf/ssl-dhparams.pem" ]; then
    echo "### Downloading recommended SSL DH parameters ..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/conf/ssl-dhparams.pem"
fi

# Create dummy certificate for nginx to start
echo "### Creating dummy certificate for $DOMAIN ..."
mkdir -p "./certbot/conf/live/$DOMAIN"

cat > "./certbot/conf/live/$DOMAIN/fullchain.pem" <<EOF
-----BEGIN CERTIFICATE-----
MIIDSjCCAjKgAwIBAgIUAoY7BmKvK6H8J6jKZQZjKZKZKZAwDQYJKoZIhvcNAQEL
BQAwFTETMBEGA1UEAwwKZHVtbXkgY2VydDAeFw0yNTAxMDEwMDAwMDBaFw0yNjAx
MDEwMDAwMDBaMBUxEzARBgNVBAMMCmR1bW15IGNlcnQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1+fWIcPm1z
nXLI2YLIkaCNdVGzdtD5ZDzGom0zc1lyrEqNKeoViYjiKWzdYCbqMM3doDPnXxGu
0aKoSdCrXfeGJX5zNpRmKJbKYmrJGLBcLjzwYDxGr0K3bNu6Tn0hMBDGJQ1YST8w
qdLPxdGvzQm0mGhJjT5Iz8wYBFGaD3i6TppP8YqIqV7kEZpwNqDRQJxCqGfaRoJh
qLYkzQlPJ8bWJQ5yVJ1p5fWNqDh0Qzq6hJLPfQa8cNNIy2xn5zCY9dE0Kt/HEPy0
HhMRKK8PqBYSvXBSqH8rQvLvQN1qKF0T4q6cqy0aZkKJAgMBAAGjUDBOMB0GA1Ud
DgQWBBSBfZwGqKqGPfHhNGnLnQhKPjBQ9jAfBgNVHSMEGDAWgBSBfZwGqKqGPfHh
NGnLnQhKPjBQ9jAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQB7pXmB
Yq4fR7P8MZe7YqXQKNt0LQc/6S+a0aLpYGqxZ4EWWG3Sh0v1Qvq0hg7Ry5yBxZLQ
4z8LGjKYfvvxZchKAdpM5CnqQKNKKF8JlPnOQJhJvZQ5aKzKYGjhCvnNxTN8KSNp
OfFlCxXpLEy5HqFmJ1bGYmD8hQpYJ5LpYqYhTqCzKHp1J5cYqF8aLqYFfhkPqQZK
hqGxKqYfJ5LqYhKqCzLpYqYfhJvZQ5aLqYGjhCvnNxTN8KSNpOfFlCxXpLEy5HqF
mJ1bGYmD8hQpYJ5LpYqYhTqCzKHp1J5cYqF8aLqYFfhkPqQZKhqGxKqYfJ5LqYhK
qCzLpYqYfhJvZQ5aKzKYGjhCvnNxTN8KSNpOfFlCxXpLEy5HqFmJ1bGYmD8hQpYJ
-----END CERTIFICATE-----
EOF

cat > "./certbot/conf/live/$DOMAIN/privkey.pem" <<EOF
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1+fWIcPm1znXLI2YLIkaCNdVGzdtD5ZDzGom0zc1lyrEqN
KeoViYjiKWzdYCbqMM3doDPnXxGu0aKoSdCrXfeGJX5zNpRmKJbKYmrJGLBcLjzw
YDxGr0K3bNu6Tn0hMBDGJQ1YST8wqdLPxdGvzQm0mGhJjT5Iz8wYBFGaD3i6TppP
8YqIqV7kEZpwNqDRQJxCqGfaRoJhqLYkzQlPJ8bWJQ5yVJ1p5fWNqDh0Qzq6hJLP
fQa8cNNIy2xn5zCY9dE0Kt/HEPy0HhMRKK8PqBYSvXBSqH8rQvLvQN1qKF0T4q6c
qy0aZkKJAgMBAAECggEADPzqvWlJK6TqP0qGm3dxXqy0ZVGKo1KZQqGm3dxXqy0Z
VGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZ
QqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dx
Xqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVG
Ko1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQQ
KBgQDmjQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZ
QqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dx
Xqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQKBgQDQqGm3dxXqy0ZVGKo1KZQqGm3dxX
qy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGK
o1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQKB
gE7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1+fWIcPm1znXLI2YLIkaCNdVGzdtD5Z
DzGom0zc1lyrEqNKeoViYjiKWzdYCbqMM3doDPnXxGu0aKoSdCrXfeGJX5zNpRmK
JbKYmrJGLBcLjzwYDxGr0K3bNu6Tn0hMBDGJQ1YST8wqdLPAoGBAKjMzEfYyjiWA
4R4/M2bS1+fWIcPm1znXLI2YLIkaCNdVGzdtD5ZDzGom0zc1lyrEqNKeoViYjiKW
zdYCbqMM3doDPnXxGu0aKoSdCrXfeGJX5zNpRmKJbKYmrJGLBcLjzwYDxGr0K3bN
u6Tn0hMBDGJQ1YST8wqdLPxdGvzQm0mGhJjT5Iz8wYBFGaD3i6TppP8YqIqV7kEZ
pwNqDRQJxCqGfaRoJhqLYkzQlPJ8bWJQ5yVJ1p5fWNqDh0Qzq6hJLPfQa8cNNIy2
xn5zCY9dE0Kt/HEPy0HhMRKK8PqBYSvXBSqH8rQvLvQN1qKF0T4q6cqy0aZkKJAo
GAdxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy
0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1
KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQqGm3dxXqy0ZVGKo1KZQQ==
-----END PRIVATE KEY-----
EOF

echo "### Starting nginx with dummy certificate ..."
docker-compose up -d nginx

echo "### Waiting for nginx to start ..."
sleep 5

echo "### Deleting dummy certificate for $DOMAIN ..."
docker-compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$DOMAIN && \
  rm -rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### Requesting Let's Encrypt certificate for $DOMAIN ..."

# Select appropriate email arg
case "$EMAIL" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $EMAIL" ;;
esac

# Enable staging mode if needed
if [ $STAGING != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    -d $DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

echo "### Reloading nginx ..."
docker-compose exec nginx nginx -s reload

echo "### Done! Your SSL certificate has been installed."
echo "### You can now access your site at https://$DOMAIN"
