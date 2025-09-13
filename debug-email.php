<?php
// Comprehensive email debugging script
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Email Debugging Tool</h1>";

// Test 1: Check if contacto@navix.mx exists
echo "<h2>Test 1: Email Address Validation</h2>";
$test_emails = ['contacto@navix.mx', 'cbarron@navix.mx'];
foreach ($test_emails as $email) {
    echo "<p>Testing: $email</p>";
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<span style='color: green;'>✅ Valid format</span><br>";
        
        // Check MX record
        $domain = substr(strrchr($email, "@"), 1);
        if (checkdnsrr($domain, "MX")) {
            echo "<span style='color: green;'>✅ MX record exists for $domain</span><br>";
        } else {
            echo "<span style='color: red;'>❌ No MX record for $domain</span><br>";
        }
    } else {
        echo "<span style='color: red;'>❌ Invalid format</span><br>";
    }
    echo "<hr>";
}

// Test 2: SMTP Connection Test
echo "<h2>Test 2: SMTP Connection</h2>";
$smtp_host = 'smtp.office365.com';
$smtp_port = 587;

echo "<p>Testing connection to $smtp_host:$smtp_port...</p>";
$socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 10);
if ($socket) {
    echo "<span style='color: green;'>✅ Can connect to SMTP server</span><br>";
    $response = fgets($socket, 515);
    echo "<p>Server response: " . htmlspecialchars(trim($response)) . "</p>";
    fclose($socket);
} else {
    echo "<span style='color: red;'>❌ Cannot connect to SMTP server: $errstr ($errno)</span><br>";
}

// Test 3: Authentication Test
echo "<h2>Test 3: SMTP Authentication</h2>";
$username = 'cbarron@navix.mx';
$password = 'Daniela12080401$$';

function testSMTPAuth($host, $port, $username, $password) {
    $socket = @fsockopen($host, $port, $errno, $errstr, 30);
    if (!$socket) {
        return "Cannot connect: $errstr";
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
        return "TLS encryption failed";
    }
    
    fputs($socket, "EHLO localhost\r\n");
    fgets($socket, 515);
    
    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 515);
    
    fputs($socket, base64_encode($username) . "\r\n");
    fgets($socket, 515);
    
    fputs($socket, base64_encode($password) . "\r\n");
    $auth_response = fgets($socket, 515);
    
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    if (strpos($auth_response, '235') !== false) {
        return "SUCCESS";
    } else {
        return "Auth failed: " . trim($auth_response);
    }
}

$auth_result = testSMTPAuth($smtp_host, $smtp_port, $username, $password);
if ($auth_result === "SUCCESS") {
    echo "<span style='color: green;'>✅ SMTP Authentication successful</span><br>";
} else {
    echo "<span style='color: red;'>❌ SMTP Authentication failed: $auth_result</span><br>";
}

// Test 4: Send test email to your own address first
echo "<h2>Test 4: Send Test Email to Your Address</h2>";
echo "<p>Sending test email to cbarron@navix.mx (your address)...</p>";

function sendTestEmail($to, $subject, $message) {
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
    $headers .= "Subject: $subject\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "\r\n";
    
    fputs($socket, $headers . $message . "\r\n.\r\n");
    $response = fgets($socket, 515);
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return strpos($response, '250') !== false;
}

// Test to your own email first
if (sendTestEmail('cbarron@navix.mx', 'Test Email - Your Address', 'This is a test email sent to your own address to verify SMTP is working.')) {
    echo "<span style='color: green;'>✅ Test email sent to cbarron@navix.mx successfully</span><br>";
    echo "<p><strong>Check your inbox/spam folder for this test email.</strong></p>";
} else {
    echo "<span style='color: red;'>❌ Failed to send test email to cbarron@navix.mx</span><br>";
}

// Test to contacto@navix.mx
echo "<h2>Test 5: Send Test Email to contacto@navix.mx</h2>";
if (sendTestEmail('contacto@navix.mx', 'Test Email - Contact Address', 'This is a test email sent to contacto@navix.mx to verify delivery.')) {
    echo "<span style='color: green;'>✅ Test email sent to contacto@navix.mx successfully</span><br>";
    echo "<p><strong>Check the contacto@navix.mx inbox/spam folder.</strong></p>";
} else {
    echo "<span style='color: red;'>❌ Failed to send test email to contacto@navix.mx</span><br>";
}

echo "<h2>Summary</h2>";
echo "<p>If all tests pass but you're not receiving emails, check:</p>";
echo "<ul>";
echo "<li>Spam/Junk folders</li>";
echo "<li>Email forwarding rules</li>";
echo "<li>Whether contacto@navix.mx is properly configured</li>";
echo "<li>Office 365 admin settings</li>";
echo "</ul>";
?>
