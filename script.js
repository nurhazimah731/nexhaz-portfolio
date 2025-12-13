document.addEventListener('DOMContentLoaded', function() {
    
    // **Penetapan Awal Pembolehubah Global (untuk Navigation)**
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('nav ul');

    // =========================================================
    // 1. NAVIGATION LOGIC (SMOOTH SCROLLING & BURGER MENU)
    // =========================================================

    // Burger Menu Toggle untuk mobile
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling untuk semua pautan navbar
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Logik untuk mengimbangi ketinggian nav bar (fixed header)
                const headerHeight = document.querySelector('nav').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // Tutup menu pada peranti mudah alih selepas klik (jika menu sedang terbuka)
            if (navLinks && navLinks.classList.contains('active')) {
                setTimeout(() => {
                    navLinks.classList.remove('active');
                }, 300); 
            }
        });
    });

    // =========================================================
    // 2. GALLERY CAROUSEL LOGIC
    // =========================================================

    // Fungsi untuk menguruskan setiap carousel
    function setupCarousel(containerId) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Carousel container with ID '${containerId}' not found.`);
            return null; 
        }
        
        // Cari slaid dalam container spesifik
        const slides = container.querySelectorAll('.carousel-slide'); 
        if (slides.length === 0) return null;

        let currentSlide = 0;

        // Inisialisasi Gaya: Tetapkan gaya dan pastikan slaid pertama aktif
        slides.forEach((slide, index) => {
            slide.style.transition = 'opacity 0.5s ease'; 
            slide.style.position = 'absolute'; 
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.top = '0';

             if (index === 0) {
                 slide.style.opacity = '1';
                 slide.classList.add('active');
                 currentSlide = 0;
             } else {
                 slide.style.opacity = '0';
                 slide.classList.remove('active');
             }
        });
        
        // Fungsi untuk menukar slide
        function showSlide(index) {
            // Logik Modulo untuk pengulangan (looping)
            let newIndex = (index % slides.length + slides.length) % slides.length;
            
            if (newIndex === currentSlide) return;

            // Sembunyikan slide semasa
            slides[currentSlide].style.opacity = '0';
            slides[currentSlide].classList.remove('active');

            currentSlide = newIndex;

            // Tunjukkan slide baru
            slides[currentSlide].style.opacity = '1';
            slides[currentSlide].classList.add('active');
        }

        return {
            next: () => showSlide(currentSlide + 1),
            prev: () => showSlide(currentSlide - 1)
        };
    }

    // Inisialisasi semua carousel yang disenaraikan
    const carousels = {};
    const carouselIds = ['album-degree', 'album-class', 'album-class1','album-yp','album-graduation']; 
    
    carouselIds.forEach(id => {
        const carouselInstance = setupCarousel(id);
        if (carouselInstance) {
            carousels[id] = carouselInstance;
        }
    });
    
    // Sambungkan butang navigasi (menggunakan data-target)
    document.querySelectorAll('.carousel-nav button').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            const action = e.currentTarget.classList.contains('next-btn') ? 'next' : 'prev';
            
            const carousel = carousels[targetId]; 

            if (carousel) {
                if (action === 'next') {
                    carousel.next();
                } else {
                    carousel.prev();
                }
            } else {
                console.warn(`Carousel instance for ID '${targetId}' not found.`);
            }
        });
    });


    // =========================================================
    // 3. PENGENDALI BUTTON LAIN (View Project)
    // =========================================================
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Cari kad projek induk terdekat
            const projectCard = e.target.closest('.project-card-futuristic');
            if (projectCard) {
                // Dapatkan pautan (href) dari kad projek
                const link = projectCard.getAttribute('href');
                // Buka pautan dalam tab baharu, jika pautan sah
                if (link && link !== '#') {
                    window.open(link, '_blank');
                }
            }
        });
    });

    // =========================================================
    // 4. PENGENDALI SUBMIT BORANG (Contact Form)
    // =========================================================
    // Guna optional chaining (?) untuk memastikan borang wujud
    document.querySelector('.futuristic-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        
        alert(`Transmission Protocol: Data telah dihantar ke server dari ${name || 'anonim'}. Terima kasih! (Sila pastikan action URL borang anda betul)`);
        
        this.reset();
        
        // Sila tambahkan kod backend/AJAX/Fetch API anda di sini untuk menghantar data
        // Contoh: fetch(this.action, { method: 'POST', body: formData });
    });

    // =========================================================
    // 5. INISIALISASI ANIMASI BAR SKILL
    // =========================================================
    const skillProgressBars = document.querySelectorAll('.skill-progress-hud');

    skillProgressBars.forEach(bar => {
        const skillBarParent = bar.parentElement;
        
        // Ambil nilai kemajuan daripada atribut data-progress pada induk
        const progressValue = skillBarParent.getAttribute('data-progress');
        
        if (progressValue && !isNaN(progressValue)) {
            // Tetapkan lebar awal kepada 0%
            bar.style.width = '0%';
            
            // Tetapkan lebar baharu dengan sedikit kelewatan untuk animasi CSS
            setTimeout(() => {
                bar.style.width = `${progressValue}%`;
            }, 100); 
        } else {
            // Langkah perlindungan
            const existingWidth = bar.style.width || '0%';
            setTimeout(() => {
                bar.style.width = existingWidth;
            }, 100);
        }
    });
});