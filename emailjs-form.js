// EmailJS Form Handler - 100% Free for GitHub Pages
(function() {
    // Initialize EmailJS with your Public Key (from Account > API Keys)
    console.log('Initializing EmailJS with public key...');
    emailjs.init("ioUs9002v6slVQ5Y3"); // Your EmailJS Public Key
    console.log('EmailJS initialized successfully');
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log('Contact form found, adding event listener');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted, processing...');
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Get form data
            const formData = {
                from_name: this.querySelector('input[name="nombre"]').value,
                from_email: this.querySelector('input[name="email"]').value,
                telefono: this.querySelector('input[name="telefono"]').value,
                servicio: this.querySelector('select[name="servicio"]').value,
                message: this.querySelector('textarea[name="mensaje"]').value,
                to_email: 'contacto@navix.mx'
            };
            
            console.log('Form data collected:', formData);
            console.log('Sending email with service_n26bho9 and template_vftjp4k...');
            
            // Send email via EmailJS with your actual IDs
            emailjs.send('service_n26bho9', 'template_vftjp4k', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    console.log('Full response:', response);
                    showMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('FAILED...', error);
                    console.error('Error details:', {
                        name: error.name,
                        message: error.message,
                        status: error.status,
                        text: error.text
                    });
                    
                    let errorMessage = 'Error al enviar el mensaje. ';
                    if (error.status === 400) {
                        errorMessage += 'Verifica la configuración del template.';
                    } else if (error.status === 401) {
                        errorMessage += 'Error de autenticación. Verifica las credenciales.';
                    } else if (error.status === 404) {
                        errorMessage += 'Servicio o template no encontrado.';
                    } else {
                        errorMessage += 'Por favor, inténtalo de nuevo.';
                    }
                    
                    showMessage(errorMessage, 'error');
                })
                .finally(function() {
                    // Restore button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                });
        });
    } else {
        console.error('Contact form not found! Make sure the form has id="contactForm"');
    }
    
    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                float: right;
                padding: 0;
                margin-left: 10px;
            ">&times;</button>
        `;
        
        // Apply styles
        messageDiv.style.cssText = `
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-weight: 500;
            text-align: left;
            display: block !important;
            position: relative;
            z-index: 1000;
            ${type === 'success' ? 
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Insert message after contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm && contactForm.parentNode) {
            contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
            
            // Scroll to message
            setTimeout(() => {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
});
