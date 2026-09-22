<?php
/**
 * Shared page header: <head>, navbar and opening <main>.
 * Each page should set $page_title and $active_page before including this file.
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/functions.php';

$page_title  = $page_title  ?? SITE_NAME;
$active_page = $active_page ?? '';
$full_title  = $page_title === SITE_NAME ? SITE_NAME . ' | ' . SITE_TAGLINE : $page_title . ' | ' . SITE_NAME;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($full_title) ?></title>
    <meta name="description" content="<?= e($page_description ?? SITE_DESCRIPTION) ?>">

    <!-- Bootstrap 5 + Bootstrap Icons (CDN) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">

    <!-- Your styles -->
    <link href="<?= asset('css/style.css') ?>" rel="stylesheet">
</head>
<body>

<header>
    <nav class="navbar navbar-expand-lg bg-white border-bottom fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="<?= url('index.php') ?>"><?= e(SITE_NAME) ?></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <?php foreach ($NAV_ITEMS as $key => [$label, $file]): ?>
                        <li class="nav-item">
                            <a class="nav-link <?= active($key, $active_page) ?>"
                               <?= $key === $active_page ? 'aria-current="page"' : '' ?>
                               href="<?= url($file) ?>"><?= e($label) ?></a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </nav>
</header>

<main id="main">
