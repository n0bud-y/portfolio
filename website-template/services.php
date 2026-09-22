<?php
$page_title  = 'Services';
$active_page = 'services';
require_once __DIR__ . '/includes/header.php';

$services = [
    ['bi-code-slash', 'Web Development', 'Custom websites and web applications.'],
    ['bi-palette',    'UI / UX Design',  'Interfaces that are clear and easy to use.'],
    ['bi-search',     'SEO',             'Get found on search engines.'],
    ['bi-cloud',      'Hosting',         'Reliable hosting and deployment.'],
    ['bi-wrench',     'Maintenance',     'Updates, backups and bug fixes.'],
    ['bi-graph-up',   'Analytics',       'Understand how visitors use your site.'],
];
?>

<section class="page-banner">
    <div class="container">
        <h1 class="mb-1">Services</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="<?= url('index.php') ?>">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Services</li>
            </ol>
        </nav>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="row g-4">
            <?php foreach ($services as [$icon, $title, $text]): ?>
                <div class="col-md-6 col-lg-4 reveal">
                    <div class="card card-hover h-100 border-0 shadow-sm p-4">
                        <div class="icon-box mb-3"><i class="bi <?= e($icon) ?>"></i></div>
                        <h5><?= e($title) ?></h5>
                        <p class="text-muted mb-0"><?= e($text) ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
