</main>

<footer class="site-footer bg-dark text-light py-5 mt-5">
    <div class="container">
        <div class="row gy-4">
            <div class="col-md-4">
                <h5><?= e(SITE_NAME) ?></h5>
                <p class="text-secondary mb-0"><?= e(SITE_DESCRIPTION) ?></p>
            </div>
            <div class="col-md-4">
                <h6>Quick Links</h6>
                <ul class="list-unstyled mb-0">
                    <?php foreach ($NAV_ITEMS as [$label, $file]): ?>
                        <li><a class="link-secondary text-decoration-none" href="<?= url($file) ?>"><?= e($label) ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="col-md-4">
                <h6>Contact</h6>
                <ul class="list-unstyled text-secondary mb-0">
                    <li><i class="bi bi-envelope me-2"></i><?= e(SITE_EMAIL) ?></li>
                    <li><i class="bi bi-telephone me-2"></i><?= e(SITE_PHONE) ?></li>
                    <li><i class="bi bi-geo-alt me-2"></i><?= e(SITE_ADDRESS) ?></li>
                </ul>
            </div>
        </div>
        <hr class="border-secondary my-4">
        <p class="text-center text-secondary small mb-0">&copy; <?= date('Y') ?> <?= e(SITE_NAME) ?>. All rights reserved.</p>
    </div>
</footer>

<button id="backToTop" class="btn btn-primary rounded-circle" aria-label="Back to top">
    <i class="bi bi-arrow-up"></i>
</button>

<!-- Bootstrap JS bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- Your scripts -->
<script src="<?= asset('js/main.js') ?>"></script>
</body>
</html>
