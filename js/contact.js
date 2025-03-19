// Initialize EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS first
    (function() {
        emailjs.init("EzkV5EcS1oJzaUCT5"); // Remove the object format and just pass the public key directly
    })();

    // Form Validation
    const form = document.getElementById('contactForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;  // International phone numbers

    if (!form) {
        console.error('Contact form not found!');
        return;
    }

    // Remove the onsubmit attribute if it exists
    form.removeAttribute('onsubmit');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        let isValid = true;
        clearValidationErrors();

        // Validate Name
        if (form.name.value.length < 3) {
            showError(form.name, 'الرجاء إدخال الاسم الكامل');
            isValid = false;
        }

        // Validate Email
        if (!emailRegex.test(form.email.value)) {
            showError(form.email, 'الرجاء إدخال بريد إلكتروني صحيح');
            isValid = false;
        }

        // Validate Phone
        if (!phoneRegex.test(form.phone.value)) {
            showError(form.phone, 'الرجاء إدخال رقم هاتف صحيح');
            isValid = false;
        }

        // Validate Subject
        if (!form.subject.value) {
            showError(form.subject, 'الرجاء اختيار الموضوع');
            isValid = false;
        }

        // Validate Message
        if (form.message.value.length < 10) {
            showError(form.message, 'الرجاء كتابة رسالة لا تقل عن 10 أحرف');
            isValid = false;
        }

        if (isValid) {
            const submitButton = form.querySelector('.btn-submit');
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            // Prepare the template parameters
            const templateParams = {
                to_name: "Resort Team",
                from_name: form.querySelector('[name="from_name"]').value,
                from_email: form.querySelector('[name="from_email"]').value,
                phone: form.querySelector('[name="phone"]').value,
                subject: form.querySelector('[name="subject"]').value,
                message: form.querySelector('[name="message"]').value,
                reply_to: form.querySelector('[name="from_email"]').value
            };

            console.log('Sending email with params:', templateParams);

            // Send email using EmailJS with detailed error handling
            emailjs.send("service_j29ijnd", "template_wdp7s4r", templateParams)
                .then(function(response) {
                    console.log('EmailJS SUCCESS:', response);
                    showSuccessMessage();
                    form.reset();
                })
                .catch(function(error) {
                    console.error('EmailJS FAILED:', error);
                    let errorMessage = 'عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.';
                    
                    if (error && error.text) {
                        console.log('Error details:', error.text);
                        if (error.text.includes('Public Key is invalid')) {
                            errorMessage = 'خطأ في تكوين النظام. يرجى الاتصال بمسؤول الموقع.';
                        } else if (error.text.includes('template')) {
                            errorMessage = 'خطأ في قالب البريد الإلكتروني. يرجى الاتصال بمسؤول الموقع.';
                        }
                    }

                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message global-error';
                    errorDiv.textContent = errorMessage;
                    form.insertBefore(errorDiv, form.firstChild);
                })
                .finally(function() {
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                    
                    setTimeout(() => {
                        const messages = document.querySelectorAll('.success-message, .error-message.global-error');
                        messages.forEach(msg => msg.remove());
                    }, 5000);
                });
        }
    });
});

// Show Error Message
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    formGroup.appendChild(error);
}

// Clear Validation Errors
function clearValidationErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const error = group.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    });
}

// Show Success Message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>تم إرسال رسالتك بنجاح!</h3>
            <p>سيتواصل معك فريقنا في أقرب وقت ممكن.</p>
        </div>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successMessage, form);
}

// Add input validation on blur
document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select').forEach(input => {
    input.addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        formGroup.classList.remove('error', 'success');
        
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }

        if (this.value.trim()) {
            formGroup.classList.add('success');
        }
    });
}); 
