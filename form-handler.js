document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // DISABLED: This handler conflicts with emailjs-form.js causing double submission
    // The first handler processes and clears form values, then emailjs-form.js runs with empty values
    /*
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Deshabilitar botón y mostrar estado de carga
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Crear FormData object
            const formData = new FormData(this);
            
            // Enviar datos usando fetch
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Mostrar mensaje de éxito
                    showMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                    // Limpiar formulario
                    contactForm.reset();
                } else {
                    // Mostrar mensaje de error
                    showMessage(data.message || 'Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Error de conexión. Por favor, inténtalo de nuevo.', 'error');
            })
            .finally(() => {
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }
    */
    
    function showMessage(message, type) {
        // Remover mensaje anterior si existe
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Aplicar estilos directamente para asegurar visibilidad
        messageDiv.style.cssText = `
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-weight: 500;
            text-align: center;
            display: block;
            position: relative;
            z-index: 1000;
            ${type === 'success' ? 
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Insertar mensaje después del formulario
        const contactForm = document.getElementById('contactForm');
        if (contactForm && contactForm.parentNode) {
            contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
            
            // Scroll suave al mensaje
            setTimeout(() => {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            
            // Remover mensaje después de 8 segundos (más tiempo para leer)
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, 8000);
        }
    }
});
