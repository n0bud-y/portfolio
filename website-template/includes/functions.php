<?php
/**
 * Small helper functions used across the template.
 */

/** Escape output for HTML. */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/** Build a URL relative to BASE_URL. */
function url(string $path = ''): string
{
    return BASE_URL . '/' . ltrim($path, '/');
}

/** Build a URL to a file in /assets. */
function asset(string $path): string
{
    return url('assets/' . ltrim($path, '/'));
}

/** Add the "active" class when $key is the current page. */
function active(string $key, string $current): string
{
    return $key === $current ? 'active' : '';
}

/** Store a one-time message (shown by flash()). */
function set_flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

/** Print and clear the flash message as a Bootstrap alert. */
function flash(): void
{
    if (empty($_SESSION['flash'])) {
        return;
    }
    $f = $_SESSION['flash'];
    unset($_SESSION['flash']);
    printf(
        '<div class="alert alert-%s alert-dismissible fade show" role="alert">%s'
        . '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>',
        e($f['type']),
        e($f['message'])
    );
}

/** CSRF token: create / print field / verify. */
function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function csrf_valid(?string $token): bool
{
    return is_string($token) && hash_equals($_SESSION['csrf'] ?? '', $token);
}

/** Redirect and stop. */
function redirect(string $path): void
{
    header('Location: ' . url($path));
    exit;
}
