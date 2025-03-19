document.addEventListener('DOMContentLoaded', function() {
    // Initialize Map
    const map = L.map('map').setView([31.9539, 35.9106], 13); // Coordinates for Amman

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker for the resort
    const marker = L.marker([31.9539, 35.9106]).addTo(map);
    marker.bindPopup("<b>منتجع الجولف الفاخر</b><br>شارع زهران، عمان").openPopup();

    // Form Validation
    const form = document.getElementById('contactForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?962|0)?7[789]\d{7}$/;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Reset previous validation states
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
            showError(form.phone, 'الرجاء إدخال رقم جوال سعودي صحيح');
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
            submitForm(form);
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

// Submit Form
function submitForm(form) {
    const submitButton = form.querySelector('.btn-submit');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Here you would typically send the data to your server
        showSuccessMessage();
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        form.reset();

        // Remove success message after 5 seconds
        setTimeout(() => {
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.remove();
            }
        }, 5000);
    }, 2000);
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