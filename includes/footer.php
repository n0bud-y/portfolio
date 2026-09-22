</main>
<footer class="site-footer">
    <div class="container">
        <div class="row gy-3 align-items-end">
            <div class="col-md-4"><p class="mb-0">© <?= date('Y') ?> <?= htmlspecialchars($site['name'], ENT_QUOTES, 'UTF-8') ?></p></div>
            <div class="col-md-4 text-md-center"><p class="mb-0 text-muted">Built with PHP, Bootstrap &amp; JavaScript</p></div>
            <div class="col-md-4 text-md-end"><p class="mb-0 text-muted"><?= htmlspecialchars($site['location'], ENT_QUOTES, 'UTF-8') ?></p></div>
        </div>
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
