document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with new method
    (function() {
        emailjs.init("EzkV5EcS1oJzaUCT5");
    })();

    // Form Validation
    const form = document.getElementById('contactForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;  // International phone numbers

    if (!form) {
        console.error('Contact form not found!');
        return;
    }

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
                from_name: form.name.value,
                from_email: form.email.value,
                phone: form.phone.value,
                subject: form.subject.value,
                message: form.message.value,
                reply_to: form.email.value
            };

            console.log('Sending email with params:', templateParams);

            // Use the updated EmailJS send method
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

    // Initialize map
    const mapElement = document.getElementById('resortMap');
    if (mapElement) {
        // Coordinates for Algarve, Portugal
        const resortLocation = [37.0179, -8.0179]; 
        
        // Create map
        const map = L.map('resortMap').setView(resortLocation, 15);
        
        // Add custom styled tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
        
        // Replace the standard marker with a custom one
        const customIcon = L.icon({
            iconUrl: '../images/map-marker.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const marker = L.marker(resortLocation, {icon: customIcon}).addTo(map);
        marker.bindPopup('<strong>منتجع الجولف الفاخر</strong><br>الغارفي، البرتغال').openPopup();

        // Add zoom control with custom position
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Add scale control
        L.control.scale({
            metric: true,
            imperial: false,
            position: 'bottomleft'
        }).addTo(map);
    }
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
