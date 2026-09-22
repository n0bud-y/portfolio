<?php
declare(strict_types=1);
$pageTitle = 'Muhammad Ayan Asif — Full-Stack / Web Developer';
$currentPage = 'home';
require __DIR__ . '/includes/header.php';
?>
<section class="hero">
    <div class="container position-relative">
        <div class="row">
            <div class="col-lg-10">
                <p class="eyebrow">Muhammad Ayan Asif <span class="d-block d-md-inline ms-md-3">Full-Stack / Web Developer · Karachi, Pakistan</span></p>
                <h1>I build websites<br><em>that feel alive.</em></h1>
                <p class="hero-copy">Custom WordPress systems, modern frontend experiences, and React/Next.js development — built to work in the real world.</p>
                <div class="d-flex flex-wrap gap-4 align-items-center mt-4">
                    <a class="btn-main" href="#work">View my work <span>↗</span></a>
                    <?php if ($resumeAvailable): ?><a class="btn-quiet" href="<?= htmlspecialchars($site['resume'], ENT_QUOTES, 'UTF-8') ?>">Download resume</a><?php else: ?><span class="btn-quiet empty-link" title="Add resume.pdf to the project root">Resume — add PDF</span><?php endif; ?>
                </div>
                <div class="hero-meta"><span><?= htmlspecialchars($site['availability'], ENT_QUOTES, 'UTF-8') ?></span><span>System / Online</span></div>
            </div>
        </div>
    </div>
</section>
<section class="proof-strip" aria-label="Capabilities">
    <div class="marquee container"><span>Real client work</span><span>Custom WordPress</span><span>WooCommerce</span><span>JavaScript</span><span>React / Next.js</span><span>PHP</span><span>GSAP</span></div>
</section>
<section class="section-pad" id="work">
    <div class="container">
        <div class="row mb-5 reveal"><div class="col-lg-7"><p class="section-label">01 / Selected work</p><h2 class="section-title">Work that solves<br>real problems.</h2></div><div class="col-lg-4 ms-auto align-self-end"><p class="section-intro">A collection of business websites, CMS builds, ecommerce experiences, and frontend work.</p></div></div>
        <div class="row g-4">
            <?php foreach ($site['projects'] as $project): ?>
                <div class="col-md-6 reveal">
                    <a class="project-card" href="/work/project.php?slug=<?= urlencode($project['slug']) ?>">
                        <div class="project-visual <?= htmlspecialchars($project['visual_class'], ENT_QUOTES, 'UTF-8') ?>"><span class="project-number"><?= htmlspecialchars($project['number'], ENT_QUOTES, 'UTF-8') ?></span></div>
                        <div class="d-flex justify-content-between align-items-start gap-3"><div><h3 class="project-name"><?= htmlspecialchars($project['name'], ENT_QUOTES, 'UTF-8') ?></h3><p class="project-meta mb-0"><?= htmlspecialchars($project['category'], ENT_QUOTES, 'UTF-8') ?> · <?= htmlspecialchars($project['year'], ENT_QUOTES, 'UTF-8') ?></p></div><span class="fs-3 text-muted">↗</span></div>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="section-pad pt-0" id="featured">
    <div class="container"><div class="featured reveal"><div class="row g-5 align-items-center"><div class="col-lg-7"><p class="section-label">01 / Featured project</p><div class="project-visual visual-purple mt-3"></div></div><div class="col-lg-5"><p class="eyebrow">Custom CMS build</p><h2 class="section-title">Built for clarity, not clutter.</h2><p class="section-intro">A reusable WordPress foundation for service businesses: clear content structure, responsive sections, editable CMS controls, and strong paths to contact.</p><div class="feature-list"><div><strong>The build</strong><span>WordPress · ACF · PHP</span></div><div><strong>Focus</strong><span>Responsive UX · Reusable sections</span></div><div><strong>Outcome</strong><span>Clearer content structure</span></div></div></div></div></div></div>
</section>
<section class="section-pad" id="skills"><div class="container"><div class="row mb-5 reveal"><div class="col-lg-6"><p class="section-label">02 / Skills</p><h2 class="section-title">A practical<br>stack.</h2></div><div class="col-lg-5 ms-auto align-self-end"><p class="section-intro">Grouped by how I use the tools in real work — not by artificial percentage bars.</p></div></div><div class="row g-4"><?php foreach ([['Frontend','HTML · CSS · JavaScript · React · Next.js · Bootstrap · GSAP · jQuery'],['CMS / Website Development','WordPress · Custom Themes · ACF · Custom Post Types · WooCommerce · Shopify'],['Backend','PHP · Laravel · Node.js · MySQL · SQL'],['Tools','Git · GitHub · Vite · npm · Composer · Figma · VS Code'] ] as $group): ?><div class="col-md-6 reveal"><div class="skill-group"><h3><?= $group[0] ?></h3><p class="text-muted mb-0"><?= $group[1] ?></p></div></div><?php endforeach; ?></div></div></section>
<section class="section-pad" id="about"><div class="container"><div class="row g-5"><div class="col-lg-4 reveal"><p class="section-label">03 / About</p><h2 class="section-title">More than a CMS developer.</h2></div><div class="col-lg-8 reveal"><p class="about-quote">Building for the browser taught me how things look. Building real projects taught me how things actually work.</p><p class="about-copy mt-4">I started with websites and CMS-driven experiences, working heavily with WordPress, custom themes, ACF, WooCommerce, PHP, JavaScript, and responsive frontend development. Today I’m expanding deeper into React, Next.js, modern frontend architecture, and full-stack development.</p></div></div></div></section>
<section class="section-pad" id="experience"><div class="container"><div class="row"><div class="col-lg-4 reveal"><p class="section-label">04 / Experience</p><h2 class="section-title">Where I’m<br>building.</h2></div><div class="col-lg-7 ms-auto"><div class="timeline-item reveal"><span class="date">Current role · Dates editable</span><h3 class="mt-3">CMS Developer</h3><p class="text-muted">Software House / Startup · Karachi, Pakistan</p><p class="text-muted">Custom WordPress development, theme development, CMS integration, ACF implementation, responsive frontend development, WooCommerce projects, forms, integrations, and client/business website development.</p></div></div></div></div></section>
<section class="section-pad"><div class="container"><div class="row mb-5 reveal"><div class="col-lg-6"><p class="section-label">05 / What I build</p><h2 class="section-title">Useful digital<br>experiences.</h2></div></div><div class="row g-4"><?php foreach ([['01','Business Websites','Clear, responsive websites that help real businesses communicate and convert.','WordPress · PHP · Bootstrap'],['02','Custom WordPress Systems','Flexible content systems built around how teams actually publish and maintain content.','WordPress · ACF · Custom Themes'],['03','E-commerce Experiences','Product-focused shopping experiences with practical WooCommerce foundations.','WooCommerce · PHP · JavaScript'],['04','Modern React / Next.js Interfaces','A growing focus on component-driven frontend architecture and modern web experiences.','React · Next.js · GSAP']] as $capability): ?><div class="col-md-6 reveal"><div class="capability"><span class="capability-number"><?= $capability[0] ?></span><h3><?= $capability[1] ?></h3><p><?= $capability[2] ?></p><small class="text-muted"><?= $capability[3] ?></small></div></div><?php endforeach; ?></div></div></section>
<section class="section-pad pt-0" id="contact"><div class="container"><div class="contact-panel reveal"><p class="section-label">06 / Contact</p><h2 class="section-title">Let’s build<br>something useful.</h2><p class="section-intro mb-4">For recruiters, collaborators, and clients — I’m open to conversations about thoughtful web work.</p><?php if ($site['email']): ?><a class="contact-email" href="mailto:<?= htmlspecialchars($site['email'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($site['email'], ENT_QUOTES, 'UTF-8') ?> ↗</a><?php else: ?><p class="contact-email text-muted">Add your email in config/site.php ↗</p><?php endif; ?><div class="d-flex gap-4 mt-4"><a class="btn-quiet" href="<?= htmlspecialchars($site['linkedin'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener">LinkedIn ↗</a><?php if ($site['github']): ?><a class="btn-quiet" href="<?= htmlspecialchars($site['github'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener">GitHub ↗</a><?php else: ?><span class="btn-quiet empty-link">GitHub — add URL</span><?php endif; ?></div></div></div></section>
<?php require __DIR__ . '/includes/footer.php'; ?>
