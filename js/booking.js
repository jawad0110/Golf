// Initialize EmailJS with your public user ID
(function(){
    emailjs.init("EzkV5EcS1oJzaUCT5"); // Replace with your actual EmailJS user ID
})();

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

// Initialize Flatpickr Date Pickers
document.addEventListener('DOMContentLoaded', function() {
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
            showError(form.phone, 'الرجاء إدخال رقم هاتف صحيح');
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
            "service_j29ijnd", // Ensure this is correct
            "template_aubmy7p", // Ensure this is correct
            {
                name: bookingDetails.name,
                email: bookingDetails.email,
                phone: bookingDetails.phone,
                package: bookingDetails.package,
                check_in: bookingDetails.checkIn,
                check_out: bookingDetails.checkOut,
                nights: bookingDetails.nights,
                guests: bookingDetails.guests,
                total_price: bookingDetails.totalPrice,
                special_requests: bookingDetails.specialRequests,
                booking_date: new Date().toLocaleDateString('ar-JO')
            }
        );

        if (customerEmailResponse.status === 200) {
            // Send notification to admin
            const adminEmailResponse = await emailjs.send(
                "service_j29ijnd", // Ensure this is correct
                "template_aubmy7p", // Ensure this is correct
                {
                    name: "Admin",
                    email: "admin@luxurygolfresort.com",
                    phone: bookingDetails.phone,
                    customer_name: bookingDetails.name,
                    customer_email: bookingDetails.email,
                    customer_phone: bookingDetails.phone,
                    package: bookingDetails.package,
                    check_in: bookingDetails.checkIn,
                    check_out: bookingDetails.checkOut,
                    nights: bookingDetails.nights,
                    guests: bookingDetails.guests,
                    total_price: bookingDetails.totalPrice,
                    special_requests: bookingDetails.specialRequests,
                    booking_date: new Date().toLocaleDateString('ar-JO')
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
