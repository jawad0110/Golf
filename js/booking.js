// Package Prices (in JOD)
const packagePrices = {
    'gold': 450,     // Five Rounds Package
    'silver': 300,   // Triple Tee Package
    'bronze': 175,   // Relaxation Package
    'family': 400,   // Family Package
    'honeymoon': 525 // Honeymoon Package
};

// Package Names in Arabic
const packageNames = {
    'gold': 'باقة الخمس جولات',
    'silver': 'باقة الجولة الثلاثية',
    'bronze': 'باقة استراحة استجمام',
    'family': 'عرض العائلة',
    'honeymoon': 'باقة شهر العسل'
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.querySelector('.progress-bar');
    const progressInfo = document.querySelector('.progress-info');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const submitButton = document.querySelector('.btn-submit');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Step information for progress info
    const stepInfo = [
        {
            title: 'اختر برنامجك السياحي المفضل',
            description: 'حدد البرنامج وتاريخ السفر وعدد المسافرين'
        },
        {
            title: 'أدخل معلومات المسافر',
            description: 'نحتاج إلى معلوماتك الشخصية لإتمام الحجز'
        },
        {
            title: 'إتمام عملية الدفع',
            description: 'ادفع بأمان باستخدام بطاقتك المفضلة'
        },
        {
            title: 'تأكيد الحجز',
            description: 'راجع تفاصيل حجزك قبل التأكيد النهائي'
        }
    ];

    // Initialize check-in date picker
    flatpickr("#checkIn", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            // Update check-out min date
            checkOutPicker.set("minDate", selectedDates[0]);
            updateBookingSummary();
        }
    });

    // Initialize check-out date picker
    const checkOutPicker = flatpickr("#checkOut", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function() {
            updateBookingSummary();
        }
    });

    // Add event listeners for form inputs
    document.getElementById('package').addEventListener('change', updateBookingSummary);
    document.getElementById('adults').addEventListener('change', updateBookingSummary);
    document.getElementById('children').addEventListener('change', updateBookingSummary);

    // Initialize form validation
    initializeFormValidation();

    // Update progress bar
    function updateProgress() {
        // Update progress steps
        progressSteps.forEach((step, idx) => {
            if (idx + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (idx + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('completed', 'active');
            }
        });

        // Update progress bar
        progressBar.setAttribute('data-progress', currentStep);

        // Update progress info
        const info = stepInfo[currentStep - 1];
        progressInfo.querySelector('h3').textContent = info.title;
        progressInfo.querySelector('p').textContent = info.description;
    }

    // Show current step
    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === stepNumber) {
                step.classList.add('active');
            }
        });
        currentStep = stepNumber;
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Validate current step
    function validateStep(stepNumber) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        // Remove all existing error messages
        currentStepElement.querySelectorAll('.error-message').forEach(el => el.remove());

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'هذا الحقل مطلوب';
                input.parentNode.appendChild(errorMessage);
            } else {
                input.classList.remove('error');
            }
        });

        // Validate email format in step 2
        if (stepNumber === 2) {
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
                
                // Remove existing error message if any
                const existingError = emailInput.parentNode.querySelector('.error-message');
                if (existingError) existingError.remove();
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'الرجاء إدخال بريد إلكتروني صحيح';
                emailInput.parentNode.appendChild(errorMessage);
            }
        }

        return isValid;
    }

    // Update booking summary
    function updateSummary() {
        const package = document.getElementById('package').value;
        const travelDate = document.getElementById('travel-date').value;
        const travelers = document.getElementById('travelers').value;
        const packagePrice = packagePrices[package] || 0;
        const totalPrice = packagePrice * parseInt(travelers || 0);

        // Get package name in Arabic
        const packageName = packageNames[package] || document.querySelector(`#package option[value="${package}"]`).textContent;

        // Format date in Arabic
        const formattedDate = travelDate ? new Date(travelDate).toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';

        // Update summary in payment step
        document.getElementById('summary-package').textContent = packageName;
        document.getElementById('summary-date').textContent = formattedDate;
        document.getElementById('summary-travelers').textContent = travelers;
        document.getElementById('summary-total').textContent = `${totalPrice} دينار`;

        // Update confirmation step
        document.getElementById('confirm-name').textContent = document.getElementById('fullname').value;
        document.getElementById('confirm-email').textContent = document.getElementById('email').value;
        document.getElementById('confirm-phone').textContent = document.getElementById('phone').value;
        document.getElementById('confirm-package').textContent = packageName;
        document.getElementById('confirm-date').textContent = formattedDate;
        document.getElementById('confirm-travelers').textContent = travelers;
        document.getElementById('confirm-total').textContent = `${totalPrice} دينار`;
    }

    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    updateSummary();
                    showStep(currentStep + 1);
                }
            }
        });
    });

    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Show loading state
            const submitBtn = document.querySelector('.btn-submit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate server request (remove in production)
            setTimeout(() => {
                // Generate booking reference
                const bookingRef = 'BK' + Date.now().toString().slice(-6);
                document.getElementById('booking-reference').textContent = bookingRef;

                // Hide form and show success message
                form.style.display = 'none';
                document.querySelector('.booking-success').style.display = 'block';

                // You would typically send the booking data to your server here
                const bookingData = {
                    package: document.getElementById('package').value,
                    travelDate: document.getElementById('travel-date').value,
                    travelers: document.getElementById('travelers').value,
                    fullname: document.getElementById('fullname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    specialRequests: document.getElementById('special-requests').value,
                    bookingReference: bookingRef
                };
                console.log('Booking Data:', bookingData);
                
                // Reset loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 1500);
        }
    });

    // Add input validation styling
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.remove('error');
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) errorMessage.remove();
            }
        });
    });

    // Initialize date input with minimum date of today
    const dateInput = document.getElementById('travel-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Format expiry date input
    const expiryInput = document.getElementById('card-expiry');
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0,2) + '/' + value.slice(2,4);
        }
        e.target.value = value;
    });

    // Format CVV input
    const cvvInput = document.getElementById('card-cvv');
    cvvInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.slice(0,3);
    });
});

// Update Booking Summary
function updateBookingSummary() {
    const selectedPackage = document.getElementById('package').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;

    // Update selected package with Arabic name
    document.getElementById('selectedPackage').textContent = 
        selectedPackage ? packageNames[selectedPackage] : '-';

    // Format and update dates
    document.getElementById('selectedCheckIn').textContent = checkIn ? new Date(checkIn).toLocaleDateString('ar-JO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '-';
    
    document.getElementById('selectedCheckOut').textContent = checkOut ? new Date(checkOut).toLocaleDateString('ar-JO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '-';

    // Calculate nights
    let nights = 0;
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    }
    document.getElementById('nightsCount').textContent = nights > 0 ? `${nights} ليلة` : '-';

    // Update guests count with proper Arabic pluralization
    const guestsText = [];
    if (adults > 0) {
        guestsText.push(`${adults} ${adults === 1 ? 'بالغ' : adults === 2 ? 'بالغان' : 'بالغين'}`);
    }
    if (children > 0) {
        guestsText.push(`${children} ${children === 1 ? 'طفل' : children === 2 ? 'طفلان' : 'أطفال'}`);
    }
    document.getElementById('guestsCount').textContent = guestsText.length > 0 ? guestsText.join(' و ') : '-';

    // Calculate total price with detailed breakdown
    let totalPrice = 0;
    let priceBreakdown = [];
    
    if (selectedPackage && nights > 0) {
        const basePrice = packagePrices[selectedPackage] * nights;
        totalPrice += basePrice;
        priceBreakdown.push(`سعر الباقة: ${basePrice.toLocaleString()} دينار`);

        // Add child rate (50% of adult rate)
        if (children > 0) {
            const childrenPrice = packagePrices[selectedPackage] * 0.5 * nights * children;
            totalPrice += childrenPrice;
            priceBreakdown.push(`رسوم الأطفال: ${childrenPrice.toLocaleString()} دينار`);
        }
    }

    // Update price breakdown and total
    const priceElement = document.getElementById('totalPrice');
    if (totalPrice > 0) {
        priceElement.innerHTML = `
            <div class="price-breakdown">
                ${priceBreakdown.map(item => `<div>${item}</div>`).join('')}
                <div class="total-line"></div>
                <div class="total">الإجمالي: ${totalPrice.toLocaleString()} دينار</div>
            </div>
        `;
    } else {
        priceElement.textContent = '-';
    }

    // Show/hide booking summary
    const summaryElement = document.querySelector('.booking-summary');
    if (selectedPackage || checkIn || checkOut || adults > 0 || children > 0) {
        summaryElement.classList.add('active');
    }
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('bookingForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?962|0)?7[789]\d{7}$/;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Reset previous validation states
        clearValidationErrors();

        // Validate Package Selection
        if (!form.package.value) {
            showError(form.package, 'الرجاء اختيار باقة');
            isValid = false;
        }

        // Validate Dates
        if (!form.checkIn.value) {
            showError(form.checkIn, 'الرجاء اختيار تاريخ الوصول');
            isValid = false;
        }
        if (!form.checkOut.value) {
            showError(form.checkOut, 'الرجاء اختيار تاريخ المغادرة');
            isValid = false;
        }

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
            showError(form.phone, 'الرجاء إدخال رقم هاتف أردني صحيح');
            isValid = false;
        }

        if (isValid) {
            submitForm(form);
        }
    });
}

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
        group.classList.remove('error');
        const error = group.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    });
}

// Submit Form
async function submitForm(form) {
    const submitButton = form.querySelector('.btn-submit');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Get all booking details
    const bookingDetails = {
        package: packageNames[form.package.value],
        checkIn: document.getElementById('selectedCheckIn').textContent,
        checkOut: document.getElementById('selectedCheckOut').textContent,
        nights: document.getElementById('nightsCount').textContent,
        guests: document.getElementById('guestsCount').textContent,
        totalPrice: document.querySelector('.total')?.textContent || '-',
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        specialRequests: form.specialRequests?.value || 'لا يوجد'
    };

    try {
        // Send email to customer
        const customerEmailResponse = await emailjs.send(
            "service_j29ijnd",
            "template_aubmy7p",
            {
                to_name: bookingDetails.name,
                to_email: bookingDetails.email,
                booking_package: bookingDetails.package,
                check_in: bookingDetails.checkIn,
                check_out: bookingDetails.checkOut,
                nights: bookingDetails.nights,
                guests: bookingDetails.guests,
                total_price: bookingDetails.totalPrice,
                phone: bookingDetails.phone,
                special_requests: bookingDetails.specialRequests,
                booking_date: new Date().toLocaleDateString('ar-JO')
            }
        );

        if (customerEmailResponse.status === 200) {
            // Send notification to admin
            const adminEmailResponse = await emailjs.send(
                "service_j29ijnd",
                "template_aubmy7p",
                {
                    customer_name: bookingDetails.name,
                    customer_email: bookingDetails.email,
                    booking_package: bookingDetails.package,
                    check_in: bookingDetails.checkIn,
                    check_out: bookingDetails.checkOut,
                    guests: bookingDetails.guests,
                    phone: bookingDetails.phone,
                    special_requests: bookingDetails.specialRequests,
                    total_price: bookingDetails.totalPrice
                }
            );

            if (adminEmailResponse.status === 200) {
                // Show success message
                showSuccessMessage();
                // Reset form
                form.reset();
                updateBookingSummary();
            } else {
                throw new Error('Failed to send admin notification');
            }
        } else {
            throw new Error('Failed to send customer confirmation');
        }

    } catch (error) {
        console.error('Booking submission error:', error);
        showGlobalError('عذراً، حدث خطأ أثناء إرسال الحجز. الرجاء المحاولة مرة أخرى.');
    } finally {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}

// Show Success Message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>تم استلام طلب الحجز بنجاح!</h3>
            <p>تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني. سيتواصل معك فريقنا قريباً لتأكيد الحجز.</p>
        </div>
    `;
    
    document.querySelector('.booking-container').prepend(successMessage);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Show Error Message (Global)
function showGlobalError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message global-error';
    errorMessage.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.querySelector('.booking-container').prepend(errorMessage);

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// Add smooth scrolling to form when clicking "Book Now" buttons
document.querySelectorAll('a[href="booking.html"]').forEach(button => {
    button.addEventListener('click', function(e) {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            e.preventDefault();
            bookingForm.scrollIntoView({ behavior: 'smooth' });
        }
    });
}); 
