<?php
http_response_code(404);
$page_title  = 'Page not found';
$active_page = '';
require_once __DIR__ . '/includes/header.php';
?>

<section class="section text-center">
    <div class="container">
        <h1 class="display-1 fw-bold text-primary">404</h1>
        <p class="lead">Sorry, we couldn't find that page.</p>
        <a href="<?= url('index.php') ?>" class="btn btn-primary">Back to home</a>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
