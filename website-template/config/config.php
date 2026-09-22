<?php
/**
 * Site-wide configuration.
 * Edit these values once; every page picks them up.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('SITE_NAME', 'My Website');
define('SITE_TAGLINE', 'A clean starter template');
define('SITE_DESCRIPTION', 'Boilerplate built with HTML, CSS, JavaScript, Bootstrap and PHP.');
define('SITE_EMAIL', 'you@example.com');   // Contact form messages are sent here
define('SITE_PHONE', '+00 000 000 0000');
define('SITE_ADDRESS', '123 Example Street, City, Country');

// Base URL path. Use '' when the site lives at the domain root,
// or e.g. '/website-template' when it lives in a sub-folder (XAMPP/WAMP/Laragon).
define('BASE_URL', '/website-template');

// Set to false in production to hide PHP errors.
define('DEBUG', true);

if (DEBUG) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(0);
}

date_default_timezone_set('UTC');

// Main navigation: key => [label, file]
$NAV_ITEMS = [
    'home'      => ['Home',      '/index.php'],
    'about'     => ['About',     '/about.php'],
    'services'  => ['Services',  '/services.php'],
    'portfolio' => ['Portfolio', '/portfolio.php'],
    'contact'   => ['Contact',   '/contact.php'],
];
