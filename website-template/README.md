# Website Template

Boilerplate site built with **HTML, CSS, JavaScript, Bootstrap 5 and PHP**.

## Structure

```
website-template/
├── index.php            Home
├── about.php            About
├── services.php         Services
├── portfolio.php        Portfolio (with category filter)
├── contact.php          Contact form
├── 404.php              Not-found page
├── .htaccess            Apache rules (404, security headers, caching)
├── config/
│   └── config.php       Site name, email, base URL, nav items
├── includes/
│   ├── header.php       <head> + navbar (shared)
│   ├── footer.php       Footer + scripts (shared)
│   └── functions.php    Helpers: e(), url(), asset(), flash(), CSRF
├── actions/
│   └── contact-submit.php   Contact form handler
├── assets/
│   ├── css/style.css    Your styles
│   ├── js/main.js       Your scripts
│   └── img/             Images
└── storage/             Created automatically (messages.log fallback)
```

## Run locally

1. Put the folder in your web root (XAMPP `htdocs`, Laragon `www`, etc.) **or** run PHP's built-in server:
   ```
   cd website-template
   php -S localhost:8000
   ```
   With the built-in server set `BASE_URL` to `''` in `config/config.php`.
2. Open `http://localhost/website-template/` (or `http://localhost:8000`).

## Customise

- Site name, email, phone, base URL, menu items: `config/config.php`
- Colours and layout tweaks: `assets/css/style.css` (`:root` variables)
- New page: copy `about.php`, change `$page_title` / `$active_page`, and add it to `$NAV_ITEMS`.

## Page pattern

```php
<?php
$page_title  = 'My Page';
$active_page = 'mypage';
require_once __DIR__ . '/includes/header.php';
?>
  ...content...
<?php require_once __DIR__ . '/includes/footer.php'; ?>
```

## Notes

- The contact form uses `mail()`. Locally (no mail server) messages are appended to `storage/messages.log`. For production consider PHPMailer with SMTP.
- Set `DEBUG` to `false` in `config/config.php` before deploying.
- If you change the folder name, update `BASE_URL` in `config.php` and the paths in `.htaccess`.
