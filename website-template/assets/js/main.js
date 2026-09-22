/* ==========================================================
   Main JavaScript
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

    // ---------- Back-to-top button ----------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 300);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Scroll reveal ----------
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    // ---------- Bootstrap form validation ----------
    document.querySelectorAll('.needs-validation').forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // ---------- Close mobile menu after clicking a link ----------
    const navCollapse = document.getElementById('mainNav');
    if (navCollapse) {
        navCollapse.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                const instance = bootstrap.Collapse.getInstance(navCollapse);
                if (instance) instance.hide();
            });
        });
    }
});
