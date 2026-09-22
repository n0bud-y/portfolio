<?php
$page_title  = 'Portfolio';
$active_page = 'portfolio';
require_once __DIR__ . '/includes/header.php';

// Replace with your own projects (or load from a database).
$projects = [
    ['Project One',   'Web',    'https://placehold.co/600x450?text=Project+1'],
    ['Project Two',   'Design', 'https://placehold.co/600x450?text=Project+2'],
    ['Project Three', 'Web',    'https://placehold.co/600x450?text=Project+3'],
    ['Project Four',  'Design', 'https://placehold.co/600x450?text=Project+4'],
    ['Project Five',  'Web',    'https://placehold.co/600x450?text=Project+5'],
    ['Project Six',   'Design', 'https://placehold.co/600x450?text=Project+6'],
];
?>

<section class="page-banner">
    <div class="container">
        <h1 class="mb-1">Portfolio</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="<?= url('index.php') ?>">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Portfolio</li>
            </ol>
        </nav>
    </div>
</section>

<section class="section">
    <div class="container">
        <!-- Filter buttons -->
        <div class="text-center mb-4" id="portfolioFilters">
            <button class="btn btn-primary btn-sm me-1" data-filter="all">All</button>
            <button class="btn btn-outline-primary btn-sm me-1" data-filter="Web">Web</button>
            <button class="btn btn-outline-primary btn-sm" data-filter="Design">Design</button>
        </div>

        <div class="row g-4" id="portfolioGrid">
            <?php foreach ($projects as [$title, $category, $img]): ?>
                <div class="col-md-6 col-lg-4 portfolio-item" data-category="<?= e($category) ?>">
                    <div class="card card-hover border-0 shadow-sm overflow-hidden">
                        <img src="<?= e($img) ?>" alt="<?= e($title) ?>">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?= e($title) ?></h5>
                            <span class="badge text-bg-secondary"><?= e($category) ?></span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<script>
// Simple category filter for the portfolio grid.
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('#portfolioFilters button');
    const items = document.querySelectorAll('#portfolioGrid .portfolio-item');
    buttons.forEach((btn) => btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        buttons.forEach((b) => {
            b.classList.toggle('btn-primary', b === btn);
            b.classList.toggle('btn-outline-primary', b !== btn);
        });
        items.forEach((item) => {
            item.classList.toggle('d-none', filter !== 'all' && item.dataset.category !== filter);
        });
    }));
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
