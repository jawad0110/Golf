document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Filter gallery items
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = null;

                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    // Add animation with delay based on index
                    const delay = Array.from(galleryItems).indexOf(item) * 0.1;
                    item.style.animationDelay = `${delay}s`;
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Initialize Lightbox functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3').textContent;
            const description = item.querySelector('p').textContent;

            showLightbox(img.src, title, description);
        });
    });
});

// Lightbox functionality
function showLightbox(imgSrc, title, description) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const content = `
        <div class="lightbox-content">
            <button class="close-lightbox">&times;</button>
            <img src="${imgSrc}" alt="${title}">
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        </div>
    `;
    
    lightbox.innerHTML = content;
    document.body.appendChild(lightbox);

    // Add lightbox styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .lightbox.show {
            opacity: 1;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90vh;
            margin: 20px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        .lightbox.show .lightbox-content {
            transform: scale(1);
        }
        .lightbox img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
        }
        .lightbox-info {
            padding: 1.5rem;
            text-align: center;
        }
        .close-lightbox {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1001;
        }
    `;
    document.head.appendChild(style);

    // Show lightbox with animation
    requestAnimationFrame(() => {
        lightbox.classList.add('show');
    });

    // Close lightbox on click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
            lightbox.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.head.removeChild(style);
            }, 300);
        }
    });
} 