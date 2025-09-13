<?php
// Simple email debug script - plain text output
header('Content-Type: text/plain');
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== EMAIL DEBUG TOOL ===\n\n";

// Test 1: Basic PHP info
echo "Test 1: PHP Configuration\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Mail function exists: " . (function_exists('mail') ? 'YES' : 'NO') . "\n";
echo "OpenSSL enabled: " . (extension_loaded('openssl') ? 'YES' : 'NO') . "\n\n";

// Test 2: Email validation
echo "Test 2: Email Address Validation\n";
$emails = ['contacto@navix.mx', 'cbarron@navix.mx'];
foreach ($emails as $email) {
    echo "Testing: $email\n";
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "  ✓ Valid format\n";
        
        $domain = substr(strrchr($email, "@"), 1);
        if (checkdnsrr($domain, "MX")) {
            echo "  ✓ MX record exists for $domain\n";
        } else {
            echo "  ✗ No MX record for $domain\n";
        }
    } else {
        echo "  ✗ Invalid format\n";
    }
    echo "\n";
}

// Test 3: SMTP Connection
echo "Test 3: SMTP Connection\n";
$smtp_host = 'smtp.office365.com';
$smtp_port = 587;

echo "Connecting to $smtp_host:$smtp_port...\n";
$socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 10);
if ($socket) {
    echo "✓ Connected successfully\n";
    $response = fgets($socket, 515);
    echo "Server greeting: " . trim($response) . "\n";
    fclose($socket);
} else {
    echo "✗ Connection failed: $errstr ($errno)\n";
}
echo "\n";

// Test 4: SMTP Authentication
echo "Test 4: SMTP Authentication\n";
$username = 'cbarron@navix.mx';
$password = 'Daniela12080401$$';

function testAuth($host, $port, $user, $pass) {
    $socket = @fsockopen($host, $port, $errno, $errstr, 30);
    if (!$socket) {
        return "Connection failed: $errstr";
    }
    
    fgets($socket, 515); // greeting
    fputs($socket, "EHLO localhost\r\n");
    fgets($socket, 515);
    fputs($socket, "STARTTLS\r\n");
    $response = fgets($socket, 515);
    
    if (strpos($response, '220') === false) {
        fclose($socket);
        return "STARTTLS failed: " . trim($response);
    }
    
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        fclose($socket);
        return "TLS failed";
    }
    
    fputs($socket, "EHLO localhost\r\n");
    fgets($socket, 515);
    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($user) . "\r\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($pass) . "\r\n");
    $auth_response = fgets($socket, 515);
    
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    if (strpos($auth_response, '235') !== false) {
        return "SUCCESS";
    } else {
        return "Auth failed: " . trim($auth_response);
    }
}

$auth_result = testAuth($smtp_host, $smtp_port, $username, $password);
if ($auth_result === "SUCCESS") {
    echo "✓ Authentication successful\n";
} else {
    echo "✗ Authentication failed: $auth_result\n";
}
echo "\n";

// Test 5: Send test email
echo "Test 5: Send Test Email\n";
echo "Attempting to send test email to cbarron@navix.mx...\n";

function sendTest($to) {
    $smtp_host = 'smtp.office365.com';
    $smtp_port = 587;
    $username = 'cbarron@navix.mx';
    $password = 'Daniela12080401$$';
    
    $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 30);
    if (!$socket) return false;
    
    fgets($socket, 515);
    fputs($socket, "EHLO localhost\r\n");
    fgets($socket, 515);
    fputs($socket, "STARTTLS\r\n");
    fgets($socket, 515);
    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    fputs($socket, "EHLO localhost\r\n");
    fgets($socket, 515);
    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($username) . "\r\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($password) . "\r\n");
    $auth = fgets($socket, 515);
    
    if (strpos($auth, '235') === false) {
        fclose($socket);
        return false;
    }
    
    fputs($socket, "MAIL FROM: <$username>\r\n");
    fgets($socket, 515);
    fputs($socket, "RCPT TO: <$to>\r\n");
    fgets($socket, 515);
    fputs($socket, "DATA\r\n");
    fgets($socket, 515);
    
    $headers = "From: $username\r\n";
    $headers .= "To: $to\r\n";
    $headers .= "Subject: Test Email from Debug Script\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "\r\n";
    
    $message = "This is a test email from the debug script.\nTime: " . date('Y-m-d H:i:s');
    
    fputs($socket, $headers . $message . "\r\n.\r\n");
    $response = fgets($socket, 515);
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return strpos($response, '250') !== false;
}

if (sendTest('cbarron@navix.mx')) {
    echo "✓ Test email sent to cbarron@navix.mx\n";
    echo "CHECK YOUR INBOX/SPAM FOLDER!\n";
} else {
    echo "✗ Failed to send test email to cbarron@navix.mx\n";
}
echo "\n";

echo "Test 6: Send to contacto@navix.mx\n";
if (sendTest('contacto@navix.mx')) {
    echo "✓ Test email sent to contacto@navix.mx\n";
    echo "CHECK THE CONTACT EMAIL INBOX!\n";
} else {
    echo "✗ Failed to send test email to contacto@navix.mx\n";
}

echo "\n=== SUMMARY ===\n";
echo "If emails are sent successfully but not received:\n";
echo "1. Check spam/junk folders\n";
echo "2. Verify contacto@navix.mx is configured in Office 365\n";
echo "3. Check email forwarding rules\n";
echo "4. Verify Office 365 admin settings\n";
?>
