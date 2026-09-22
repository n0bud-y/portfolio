<?php
/**
 * Handles the contact form POST.
 * Validates, then emails SITE_EMAIL. If mail() is unavailable (e.g. local dev),
 * the message is written to /storage/messages.log instead.
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('contact.php');
}

// Security checks
if (!csrf_valid($_POST['csrf'] ?? null)) {
    set_flash('danger', 'Session expired. Please try again.');
    redirect('contact.php');
}
if (!empty($_POST['website'])) {          // honeypot filled in => bot
    redirect('contact.php');
}

// Collect + sanitise
$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim($_POST['email'] ?? '');
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// Validate
$errors = [];
if ($name === '' || mb_strlen($name) > 100)                $errors[] = 'Please enter your name.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))            $errors[] = 'Please enter a valid email address.';
if ($subject === '' || mb_strlen($subject) > 150)          $errors[] = 'Please enter a subject.';
if ($message === '' || mb_strlen($message) > 3000)         $errors[] = 'Please enter a message (max 3000 characters).';

if ($errors) {
    $_SESSION['old'] = compact('name', 'email', 'subject', 'message');
    set_flash('danger', implode(' ', $errors));
    redirect('contact.php');
}

// Strip line breaks from header values to prevent header injection
$safeName    = str_replace(["\r", "\n"], ' ', $name);
$safeEmail   = str_replace(["\r", "\n"], '', $email);
$safeSubject = str_replace(["\r", "\n"], ' ', $subject);

$body    = "Name: {$safeName}\nEmail: {$safeEmail}\n\n{$message}\n";
$headers = "From: " . SITE_NAME . " <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . ">\r\n"
         . "Reply-To: {$safeEmail}\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail(SITE_EMAIL, '[Contact] ' . $safeSubject, $body, $headers);

if (!$sent) {
    // Fallback: log the message so nothing is lost during local development.
    $dir = __DIR__ . '/../storage';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $entry = '[' . date('Y-m-d H:i:s') . "]\n" . $body . str_repeat('-', 40) . "\n";
    $sent  = file_put_contents($dir . '/messages.log', $entry, FILE_APPEND | LOCK_EX) !== false;
}

unset($_SESSION['old']);
set_flash($sent ? 'success' : 'danger',
          $sent ? 'Thanks! Your message has been sent.' : 'Sorry, something went wrong. Please try again later.');
redirect('contact.php');
