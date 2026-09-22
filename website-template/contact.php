<?php
$page_title  = 'Contact';
$active_page = 'contact';
require_once __DIR__ . '/includes/header.php';

// Repopulate fields after a failed submit (set by actions/contact-submit.php)
$old = $_SESSION['old'] ?? [];
unset($_SESSION['old']);
?>

<section class="page-banner">
    <div class="container">
        <h1 class="mb-1">Contact</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="<?= url('index.php') ?>">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Contact</li>
            </ol>
        </nav>
    </div>
</section>

<section class="section">
    <div class="container">
        <?php flash(); ?>
        <div class="row g-5">
            <div class="col-lg-7">
                <form action="<?= url('actions/contact-submit.php') ?>" method="post" class="needs-validation" novalidate>
                    <?= csrf_field() ?>

                    <!-- Honeypot: hidden from humans, bots fill it in -->
                    <div class="d-none" aria-hidden="true">
                        <input type="text" name="website" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" name="name" maxlength="100"
                                   value="<?= e($old['name'] ?? '') ?>" required>
                            <div class="invalid-feedback">Please enter your name.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" maxlength="150"
                                   value="<?= e($old['email'] ?? '') ?>" required>
                            <div class="invalid-feedback">Please enter a valid email.</div>
                        </div>
                        <div class="col-12">
                            <label for="subject" class="form-label">Subject</label>
                            <input type="text" class="form-control" id="subject" name="subject" maxlength="150"
                                   value="<?= e($old['subject'] ?? '') ?>" required>
                            <div class="invalid-feedback">Please enter a subject.</div>
                        </div>
                        <div class="col-12">
                            <label for="message" class="form-label">Message</label>
                            <textarea class="form-control" id="message" name="message" rows="5" maxlength="3000" required><?= e($old['message'] ?? '') ?></textarea>
                            <div class="invalid-feedback">Please write a message.</div>
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary btn-lg">Send message</button>
                        </div>
                    </div>
                </form>
            </div>

            <div class="col-lg-5">
                <h4>Get in touch</h4>
                <ul class="list-unstyled mt-3">
                    <li class="mb-3"><i class="bi bi-envelope text-primary me-2"></i><?= e(SITE_EMAIL) ?></li>
                    <li class="mb-3"><i class="bi bi-telephone text-primary me-2"></i><?= e(SITE_PHONE) ?></li>
                    <li class="mb-3"><i class="bi bi-geo-alt text-primary me-2"></i><?= e(SITE_ADDRESS) ?></li>
                </ul>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
