<?php
// Simple email test
$to = 'contacto@navix.mx';
$subject = 'Test Email from Navix Website';
$message = 'This is a test email to verify the mail function is working.';
$headers = 'From: noreply@navix.mx';

echo "<h1>Testing Email Function</h1>";
echo "<p>Attempting to send test email...</p>";

if (mail($to, $subject, $message, $headers)) {
    echo "<p style='color: green;'>✅ Email sent successfully!</p>";
} else {
    echo "<p style='color: red;'>❌ Email failed to send</p>";
    echo "<p>Error: " . error_get_last()['message'] . "</p>";
}

echo "<p>Mail function exists: " . (function_exists('mail') ? 'YES' : 'NO') . "</p>";
echo "<p>PHP version: " . phpversion() . "</p>";
echo "<p>Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "</p>";
?>
