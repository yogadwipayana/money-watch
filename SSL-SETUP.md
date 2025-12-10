# SSL/HTTPS Setup Guide

Setup Nginx reverse proxy dengan Let's Encrypt SSL certificate untuk Money Watch.

## Prerequisites

1. Domain sudah pointing ke IP server Anda
2. Port 80 dan 443 terbuka di firewall
3. Docker dan Docker Compose terinstall

## Quick Setup

### 1. Update nginx.conf

Edit file `nginx.conf` dan ganti `yourdomain.com` dengan domain Anda:

```bash
# Cari dan ganti semua instance yourdomain.com
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx.conf
```

### 2. Jalankan Init Script

Script ini akan membuat dummy certificate, start nginx, dan request certificate dari Let's Encrypt:

```bash
# Berikan permission execute
chmod +x init-letsencrypt.sh

# Jalankan script dengan domain dan email Anda
./init-letsencrypt.sh your-actual-domain.com your-email@example.com
```

### 3. Verifikasi

Setelah selesai, akses website Anda:

```
https://your-actual-domain.com
```

## Manual Setup (Alternative)

Jika init script tidak bekerja, Anda bisa setup manual:

### 1. Start Services

```bash
docker-compose up -d
```

### 2. Request Certificate

```bash
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d your-actual-domain.com
```

### 3. Reload Nginx

```bash
docker-compose exec nginx nginx -s reload
```

## Certificate Renewal

Certificate akan otomatis di-renew oleh certbot container setiap 12 jam.

Untuk manual renewal:

```bash
docker-compose run --rm certbot renew
docker-compose exec nginx nginx -s reload
```

## Testing SSL Configuration

Setelah setup, test SSL configuration di:
- https://www.ssllabs.com/ssltest/

## Troubleshooting

### Certificate not found error

Jika nginx error karena certificate belum ada:

1. Buat dummy certificate dulu:
```bash
mkdir -p ./certbot/conf/live/your-domain.com
# Copy dummy cert dari init script
```

2. Start nginx dengan dummy cert
3. Request real certificate
4. Reload nginx

### Port 80/443 already in use

```bash
# Check apa yang menggunakan port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Stop service yang conflict
sudo systemctl stop apache2  # atau nginx
```

### Domain not pointing to server

Pastikan DNS A record sudah pointing ke IP server:

```bash
nslookup your-domain.com
```

## Nginx Configuration

### Menambah Domain/Subdomain

Edit `nginx.conf` dan tambahkan di `server_name`:

```nginx
server_name your-domain.com www.your-domain.com subdomain.your-domain.com;
```

Lalu request certificate untuk semua domain:

```bash
./init-letsencrypt.sh "your-domain.com www.your-domain.com subdomain.your-domain.com" your-email@example.com
```

### Force HTTPS

Sudah aktif secara default. Semua HTTP traffic akan redirect ke HTTPS.

### Custom Headers

Edit `nginx.conf` untuk menambah atau modify headers sesuai kebutuhan.

## Monitoring

### Check Nginx Logs

```bash
docker-compose logs -f nginx
```

### Check Certbot Logs

```bash
docker-compose logs certbot
```

### Check Certificate Expiry

```bash
docker-compose run --rm certbot certificates
```

## Production Checklist

- [ ] Domain DNS sudah pointing ke server
- [ ] Port 80 dan 443 terbuka di firewall
- [ ] nginx.conf sudah update dengan domain yang benar
- [ ] SSL certificate berhasil diinstall
- [ ] Website bisa diakses via HTTPS
- [ ] HTTP auto-redirect ke HTTPS
- [ ] Certificate auto-renewal aktif
- [ ] SSL test score A atau A+

## Security Recommendations

1. **Firewall**: Tutup semua port kecuali 22, 80, 443
2. **SSH**: Disable password auth, gunakan SSH key
3. **Updates**: Rutin update Docker images
4. **Backups**: Backup certificate di `./certbot/conf`
5. **Monitoring**: Setup monitoring untuk certificate expiry

## Support

Jika ada masalah, check:
1. Docker logs: `docker-compose logs`
2. Nginx config syntax: `docker-compose exec nginx nginx -t`
3. Certificate status: `docker-compose run --rm certbot certificates`
