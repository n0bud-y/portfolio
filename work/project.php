<?php
declare(strict_types=1);
$site = require __DIR__ . '/../config/site.php';
$slug = filter_input(INPUT_GET, 'slug', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';
$project = null;
foreach ($site['projects'] as $item) { if ($item['slug'] === $slug) { $project = $item; break; } }
if (!$project) { http_response_code(404); $pageTitle = 'Project not found — ' . $site['name']; } else { $pageTitle = $project['name'] . ' — ' . $site['name']; }
$currentPage = 'work';
require __DIR__ . '/../includes/header.php';
?>
<section class="detail-hero"><div class="container"><?php if (!$project): ?><p class="eyebrow">404 / Work</p><h1>Project not found.</h1><a class="btn-main mt-4" href="/index.php#work">Back to work ↗</a><?php else: ?><p class="eyebrow"><?= htmlspecialchars($project['number'], ENT_QUOTES, 'UTF-8') ?> / <?= htmlspecialchars($project['category'], ENT_QUOTES, 'UTF-8') ?></p><h1><?= htmlspecialchars($project['name'], ENT_QUOTES, 'UTF-8') ?></h1><p class="hero-copy mt-4"><?= htmlspecialchars($project['description'], ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?></div></section>
<?php if ($project): ?><section class="section-pad pt-0"><div class="container"><div class="project-visual <?= htmlspecialchars($project['visual_class'], ENT_QUOTES, 'UTF-8') ?>" style="height:520px"></div><div class="row g-5 mt-4"><div class="col-lg-4"><p class="section-label">Project details</p><p class="text-muted"><?= htmlspecialchars($project['status'], ENT_QUOTES, 'UTF-8') ?><br><?= htmlspecialchars($project['year'], ENT_QUOTES, 'UTF-8') ?></p><div class="skill-list"><?php foreach ($project['technologies'] as $technology): ?><span class="tag"><?= htmlspecialchars($technology, ENT_QUOTES, 'UTF-8') ?></span><?php endforeach; ?></div></div><div class="col-lg-7 ms-auto"><p class="section-label">Overview</p><h2 class="section-title">A focused build for a real-world need.</h2><p class="about-copy"><?= htmlspecialchars($project['description'], ENT_QUOTES, 'UTF-8') ?></p><div class="feature-list mt-5"><div><strong>Challenge</strong><span>Clearer communication</span></div><div><strong>Approach</strong><span>Responsive, editable sections</span></div><div><strong>Outcome</strong><span>Qualitative improvement</span></div></div></div></div></div></section><?php endif; ?><?php require __DIR__ . '/../includes/footer.php'; ?>
