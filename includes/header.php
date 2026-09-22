<?php

declare(strict_types=1);

$site = require __DIR__ . '/../config/site.php';
$pageTitle = $pageTitle ?? $site['name'] . ' — ' . $site['role'];
$pageDescription = $pageDescription ?? $site['description'];
$currentPage = $currentPage ?? 'home';
$resumeAvailable = is_file(__DIR__ . '/../resume.pdf');
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>">
    <meta name="theme-color" content="#090a0c">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="canonical" href="<?= htmlspecialchars($site['site_url'], ENT_QUOTES, 'UTF-8') ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/css/style.css" rel="stylesheet">
</head>
<body data-page="<?= htmlspecialchars($currentPage, ENT_QUOTES, 'UTF-8') ?>">
<a class="skip-link" href="#main-content">Skip to content</a>
<div class="site-loader" aria-hidden="true">
    <span>AYAN</span><span class="loader-line"></span><span>100%</span>
</div>
<nav class="site-nav navbar navbar-expand-lg fixed-top" aria-label="Main navigation">
    <div class="container">
        <a class="navbar-brand wordmark" href="/index.php">AYAN<span class="accent">.</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-4">
                <li class="nav-item"><a class="nav-link" href="/index.php#work">Work</a></li>
                <li class="nav-item"><a class="nav-link" href="/index.php#about">About</a></li>
                <li class="nav-item"><a class="nav-link" href="/index.php#experience">Experience</a></li>
                <li class="nav-item"><a class="nav-link" href="/index.php#contact">Contact</a></li>
                <li class="nav-item"><?php if ($resumeAvailable): ?><a class="nav-cta" href="<?= htmlspecialchars($site['resume'], ENT_QUOTES, 'UTF-8') ?>">Resume <span>↗</span></a><?php else: ?><span class="nav-cta empty-link" title="Add resume.pdf to the project root">Resume — add PDF</span><?php endif; ?></li>
            </ul>
        </div>
    </div>
</nav>
<main id="main-content">
