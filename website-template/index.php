<?php
$active_page = 'home'; // no $page_title: header.php falls back to the site name
require_once __DIR__ . '/includes/header.php';
?>

<!-- Hero -->
<section class="hero text-center text-lg-start">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-7">
                <h1 class="display-4">Build something great.</h1>
                <p class="lead my-4">A clean starter template with Bootstrap 5, PHP includes and vanilla JavaScript. Replace this text with your own message.</p>
                <a href="<?= url('contact.php') ?>" class="btn btn-light btn-lg me-2">Get in touch</a>
                <a href="<?= url('portfolio.php') ?>" class="btn btn-outline-light btn-lg">See our work</a>
            </div>
        </div>
    </div>
</section>

<!-- Features -->
<section class="section">
    <div class="container">
        <div class="text-center">
            <h2 class="section-title">What we offer</h2>
            <p class="section-subtitle">Short supporting sentence for this section.</p>
        </div>
        <div class="row g-4">
            <?php
            $features = [
                ['bi-lightning-charge', 'Fast',       'Lightweight pages that load quickly.'],
                ['bi-phone',            'Responsive', 'Looks great on phones, tablets and desktops.'],
                ['bi-shield-check',     'Secure',     'CSRF protection and output escaping built in.'],
            ];
            foreach ($features as [$icon, $title, $text]): ?>
                <div class="col-md-4 reveal">
                    <div class="card card-hover h-100 text-center border-0 shadow-sm p-4">
                        <div class="icon-box mx-auto mb-3"><i class="bi <?= e($icon) ?>"></i></div>
                        <h5><?= e($title) ?></h5>
                        <p class="text-muted mb-0"><?= e($text) ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Call to action -->
<section class="section bg-light">
    <div class="container text-center">
        <h2 class="section-title">Ready to start?</h2>
        <p class="section-subtitle">Tell us about your project.</p>
        <a href="<?= url('contact.php') ?>" class="btn btn-primary btn-lg">Contact us</a>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
