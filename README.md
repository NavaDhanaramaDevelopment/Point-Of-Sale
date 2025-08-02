# POS Retail System

Aplikasi Point of Sale (POS) untuk retail berbasis Laravel dengan React + Inertia.js frontend dan MySQL database.

## Features

- **Role-based Authentication** dengan 3 level akses:
  - **Admin**: Akses penuh ke semua fitur sistem
  - **Manager**: Manajemen produk, laporan, dan operasi harian
  - **Kasir**: Interface POS untuk transaksi penjualan

- **Modern Tech Stack**:
  - Laravel 12 (Backend API)
  - React + Inertia.js (Frontend)
  - Tailwind CSS (Styling dengan tema biru modern)
  - MySQL (Database)
  - Custom branding dengan logo dan color scheme yang konsisten

## Default User Accounts

Setelah setup, Anda dapat login dengan akun berikut:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@posretail.com | password123 |
| Manager | manager@posretail.com | password123 |
| Kasir | kasir@posretail.com | password123 |

## Requirements

- PHP 8.2 atau lebih tinggi
- Composer
- Node.js & NPM
- MySQL 8.0 atau lebih tinggi
- Laravel 12

## Installation

1. Clone atau download project ke directory web server Anda

2. Install dependencies PHP:
```bash
composer install
```

3. Install dependencies JavaScript:
```bash
npm install
```

4. Copy file environment:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Konfigurasi database di file `.env`:
```env
APP_NAME="POS Retail"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_retail
DB_USERNAME=root
DB_PASSWORD=
```

7. Buat database MySQL:
```sql
CREATE DATABASE pos_retail CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

8. Jalankan migration dan seeder:
```bash
php artisan migrate:fresh --seed
```

9. Build assets:
```bash
npm run build
```

10. Jalankan development server:
```bash
php artisan serve
```

Aplikasi akan berjalan di `http://localhost:8000`

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
