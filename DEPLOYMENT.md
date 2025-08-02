# Environment Configuration untuk Production

## Setup untuk Production

1. **Update .env untuk production:**
```env
APP_NAME="POS Retail"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_retail
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

2. **Optimisasi untuk Production:**
```bash
# Clear dan cache konfigurasi
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build assets untuk production
npm run build
```

3. **Security Checklist:**
- [ ] Ubah semua password default
- [ ] Set APP_DEBUG=false
- [ ] Set APP_ENV=production
- [ ] Generate APP_KEY yang baru
- [ ] Setup HTTPS
- [ ] Konfigurasi firewall
- [ ] Setup backup database

## Database Backup Script

```bash
#!/bin/bash
# backup-db.sh
mysqldump -u username -p pos_retail > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Cron Jobs

Tambahkan ke crontab untuk maintenance:
```bash
# Laravel Scheduler
* * * * * cd /path/to/pos-retail && php artisan schedule:run >> /dev/null 2>&1

# Weekly Database Backup
0 2 * * 0 /path/to/backup-db.sh
```
