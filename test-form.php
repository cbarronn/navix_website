<?php
// Script de prueba para verificar el procesamiento del formulario
echo "<h2>Test del formulario de contacto</h2>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<h3>Datos recibidos:</h3>";
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    
    // Simular respuesta JSON
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true, 
        'message' => 'Formulario procesado correctamente (modo test)',
        'data' => $_POST
    ]);
} else {
    echo "<p>Envía datos POST para probar el formulario.</p>";
}
?>
