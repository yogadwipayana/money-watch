# Deployment Guide - Money Watch with SSL

Complete deployment guide untuk Money Watch dengan Nginx reverse proxy dan SSL certificate.

## 📋 Prerequisites

1. **Server Requirements:**
   - Ubuntu 20.04+ atau Debian 11+
   - Docker & Docker Compose installed
   - Minimum 1GB RAM, 1 CPU Core
   - 10GB disk space

2. **Domain Requirements:**
   - Domain sudah terdaftar
   - DNS A record pointing ke IP server
   - Port 80 dan 443 terbuka di firewall

3. **Access:**
   - SSH access ke server
   - Root atau sudo privileges

## 🚀 Quick Deployment

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd frontend
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

Update values:
```env
API_URL=https://api.yourdomain.com
PORT=4321
DOMAIN=yourdomain.com
SSL_EMAIL=admin@yourdomain.com
```

### Step 3: Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Script akan otomatis:
- Update nginx configuration
- Build Docker images
- Start all services
- Request SSL certificate
- Configure auto-renewal

### Step 4: Verify

```bash
# Check services
docker-compose ps

# Check logs
docker-compose logs -f

# Check SSL certificate
docker-compose run --rm certbot certificates

# Access website
curl -I https://yourdomain.com
```

## 🔧 Manual Deployment

Jika automated script tidak bekerja:

### 1. Configure Nginx

```bash
# Edit nginx.conf
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx.conf
```

### 2. Build & Start

```bash
docker-compose build
docker-compose up -d
```

### 3. Setup SSL

```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh yourdomain.com your@email.com
```

## 🔄 Update Deployment

### Update Code

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
```

### Update Nginx Configuration

```bash
# Edit nginx.conf
nano nginx.conf

# Test configuration
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload
```

### Update SSL Certificate

```bash
# Renew certificate
docker-compose run --rm certbot renew

# Reload nginx
docker-compose exec nginx nginx -s reload
```

## 🛠️ Common Commands

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f nginx
docker-compose logs -f web
```

### SSL Management

```bash
# Check certificate status
docker-compose run --rm certbot certificates

# Force renewal (for testing)
docker-compose run --rm certbot renew --force-renewal

# Test renewal (dry-run)
docker-compose run --rm certbot renew --dry-run
```

### Debugging

```bash
# Check Nginx configuration
docker-compose exec nginx nginx -t

# Access container shell
docker-compose exec web sh
docker-compose exec nginx sh

# Check container logs
docker logs money-watch-frontend
docker logs money-watch-nginx

# Check resource usage
docker stats
```

## 🔐 Security Hardening

### 1. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Or iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### 2. SSH Hardening

```bash
# Disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 3. Auto Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Fail2ban

```bash
# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 Monitoring

### Health Checks

```bash
# Check service health
docker-compose ps

# HTTP health check
curl -I http://localhost

# HTTPS health check
curl -I https://yourdomain.com
```

### Logs Monitoring

```bash
# Follow all logs
docker-compose logs -f

# Follow nginx logs only
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100
```

### SSL Monitoring

Setup monitoring untuk certificate expiry:

```bash
# Create monitoring script
cat > check-ssl.sh <<'EOF'
#!/bin/bash
DOMAIN="yourdomain.com"
EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
echo "SSL Certificate expires: $EXPIRY"
EOF

chmod +x check-ssl.sh

# Add to crontab (check daily)
crontab -e
# Add: 0 9 * * * /path/to/check-ssl.sh
```

## 🔄 Backup & Restore

### Backup

```bash
# Create backup directory
mkdir -p backups

# Backup SSL certificates
tar -czf backups/ssl-backup-$(date +%Y%m%d).tar.gz certbot/

# Backup environment
cp .env backups/.env.backup

# Backup nginx config
cp nginx.conf backups/nginx.conf.backup
```

### Restore

```bash
# Restore SSL certificates
tar -xzf backups/ssl-backup-YYYYMMDD.tar.gz

# Restore configuration
cp backups/.env.backup .env
cp backups/nginx.conf.backup nginx.conf

# Restart services
docker-compose restart
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting service
sudo systemctl stop apache2
# or
sudo systemctl stop nginx
```

### SSL Certificate Error

```bash
# Check certificate
docker-compose run --rm certbot certificates

# Check nginx config
docker-compose exec nginx nginx -t

# View certbot logs
docker-compose logs certbot

# Force certificate renewal
docker-compose run --rm certbot renew --force-renewal
docker-compose exec nginx nginx -s reload
```

### DNS Not Resolving

```bash
# Check DNS resolution
nslookup yourdomain.com
dig yourdomain.com

# Check from server
curl -I http://yourdomain.com
```

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check resource usage
df -h  # Disk space
free -m  # Memory

# Prune unused resources
docker system prune -a
```

## 📞 Support Checklist

Before asking for help, verify:

- [ ] DNS pointing to correct IP
- [ ] Ports 80 and 443 are open
- [ ] .env file configured correctly
- [ ] Docker services running: `docker-compose ps`
- [ ] Nginx config valid: `docker-compose exec nginx nginx -t`
- [ ] SSL certificate exists: `docker-compose run --rm certbot certificates`
- [ ] Logs checked: `docker-compose logs`

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Domain DNS properly configured
- [ ] SSL certificate installed and valid
- [ ] Auto-renewal working
- [ ] Firewall configured
- [ ] SSH hardened
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks passing
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] HTTPS redirect working

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
