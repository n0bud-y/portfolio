<?php
$page_title  = 'About';
$active_page = 'about';
require_once __DIR__ . '/includes/header.php';
?>

<section class="page-banner">
    <div class="container">
        <h1 class="mb-1">About Us</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="<?= url('index.php') ?>">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">About</li>
            </ol>
        </nav>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="row align-items-center g-5">
            <div class="col-lg-6 reveal">
                <img src="https://placehold.co/600x400" class="img-fluid rounded shadow" alt="About image">
            </div>
            <div class="col-lg-6 reveal">
                <h2 class="section-title">Our story</h2>
                <p class="text-muted">Write a short introduction here. Explain who you are, what you do and what makes you different.</p>
                <ul class="list-unstyled">
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i>First key point</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i>Second key point</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i>Third key point</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section class="section bg-light">
    <div class="container">
        <div class="row text-center g-4">
            <?php foreach ([['120+', 'Projects'], ['80+', 'Clients'], ['10', 'Years'], ['15', 'Awards']] as [$num, $label]): ?>
                <div class="col-6 col-md-3 reveal">
                    <div class="display-5 fw-bold text-primary"><?= e($num) ?></div>
                    <div class="text-muted"><?= e($label) ?></div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
