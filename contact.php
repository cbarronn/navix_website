<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $servicio = $_POST['servicio'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    // Validate required fields
    if (empty($nombre) || empty($email) || empty($servicio) || empty($mensaje)) {
        header('Location: index.html?error=' . urlencode('Por favor completa todos los campos requeridos'));
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header('Location: index.html?error=' . urlencode('Por favor ingresa un email válido'));
        exit;
    }

    // Service mapping
    $servicios = [
        'erp' => 'ERP Dynamics NAV',
        'web' => 'Desarrollo Web',
        'mobile' => 'Desarrollo Móvil',
        'automation' => 'Automatización'
    ];
    $servicio_nombre = $servicios[$servicio] ?? $servicio;

    // Prepare email
    $to = 'contacto@navix.mx';
    $subject = 'Contacto desde sitio web - ' . $servicio_nombre;
    
    $message = "Nuevo contacto desde el sitio web:\n\n";
    $message .= "Nombre: " . $nombre . "\n";
    $message .= "Email: " . $email . "\n";
    $message .= "Teléfono: " . $telefono . "\n";
    $message .= "Servicio: " . $servicio_nombre . "\n";
    $message .= "Mensaje: " . $mensaje . "\n\n";
    $message .= "Enviado el: " . date('Y-m-d H:i:s');

    // Simple headers
    $headers = "From: noreply@navix.mx\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Try to send email
    $mail_sent = mail($to, $subject, $message, $headers);
    
    if ($mail_sent) {
        header('Location: index.html?success=' . urlencode('¡Mensaje enviado correctamente! Te contactaremos pronto.'));
    } else {
        // Log error for debugging
        error_log("Mail failed to send. To: $to, Subject: $subject");
        header('Location: index.html?error=' . urlencode('Error al enviar el mensaje. Por favor intenta de nuevo o contactanos directamente.'));
    }
    exit;
}

// Handle GET for testing
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo "<h1>Contact.php Test</h1>";
    echo "<p>PHP mail function available: " . (function_exists('mail') ? 'YES' : 'NO') . "</p>";
    echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";
    echo "<p>Server: " . $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown' . "</p>";
    exit;
}

// Other methods not allowed
http_response_code(405);
echo "Method not allowed";
?>
