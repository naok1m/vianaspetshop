// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todas as funcionalidades
    initializeNavigation();
    initializeSmoothScrolling();
    initializeProductTabs();
    initializeGalleryFilter();
    initializeTestimonialsCarousel();
    initializeContactForm();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeLazyLoading();
    
    // SEO e Performance
    initializeSEOFeatures();
});

// ========================================
// NAVEGAÇÃO E MENU MOBILE
// ========================================
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    // Toggle menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Scroll do header
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-hide header ao scrollar para baixo
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Destaque do link ativo baseado na seção atual
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// SMOOTH SCROLLING
// ========================================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// TABS DE PRODUTOS
// ========================================
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCategories = document.querySelectorAll('.product-category');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Remove active de todas as categorias
            productCategories.forEach(category => category.classList.remove('active'));
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
            
            // Mostra a categoria correspondente
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Animação suave
                targetElement.style.opacity = '0';
                setTimeout(() => {
                    targetElement.style.opacity = '1';
                }, 50);
            }
        });
    });
}

// ========================================
// FILTRO DA GALERIA
// ========================================
function initializeGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Remove active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
            
            // Filtra os itens
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    // Animação de entrada
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Modal da galeria
    initializeGalleryModal();
}

function initializeGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            // Criar modal
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <img src="${imgSrc}" alt="${imgAlt}">
                        <p>${imgAlt}</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Fechar modal
            const closeModal = () => {
                modal.remove();
                document.body.style.overflow = 'auto';
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
            
            // Fechar com ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeModal();
            });
        });
    });
}

// ========================================
// CARROSSEL DE DEPOIMENTOS
// ========================================
function initializeTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialCards[index].classList.add('active');
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    
    // Auto-rotate
    setInterval(nextTestimonial, 5000);
    
    // Swipe support para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextTestimonial();
                } else {
                    prevTestimonial();
                }
            }
        }
    }
}

// ========================================
// FORMULÁRIO DE CONTATO
// ========================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação personalizada
            if (validateForm()) {
                submitForm();
            }
        });
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // Validar nome
    if (name.value.trim() === '') {
        showFieldError(name, 'Nome é obrigatório');
        isValid = false;
    } else {
        clearFieldError(name);
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showFieldError(email, 'Email inválido');
        isValid = false;
    } else {
        clearFieldError(email);
    }
    
    // Validar assunto
    if (subject.value === '') {
        showFieldError(subject, 'Selecione um assunto');
        isValid = false;
    } else {
        clearFieldError(subject);
    }
    
    // Validar mensagem
    if (message.value.trim().length < 10) {
        showFieldError(message, 'Mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
    } else {
        clearFieldError(message);
    }
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.getAttribute('name');
    const value = field.value.trim();
    
    switch(fieldName) {
        case 'name':
            if (value === '') {
                showFieldError(field, 'Nome é obrigatório');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Email inválido');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                showFieldError(field, 'Mensagem deve ter pelo menos 10 caracteres');
            } else {
                clearFieldError(field);
            }
            break;
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#f44336';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#E0E0E0';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envio (substituir por integração real)
    setTimeout(() => {
        // Resetar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Mostrar mensagem de sucesso
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Limpar formulário
        form.reset();
        
        // Integração com WhatsApp como fallback
        const message = `Nome: ${formData.get('name')}\nEmail: ${formData.get('email')}\nTelefone: ${formData.get('phone')}\nAssunto: ${formData.get('subject')}\nMensagem: ${formData.get('message')}`;
        const whatsappURL = `https://wa.me/5585999998888?text=${encodeURIComponent(message)}`;
        
        // Opcional: abrir WhatsApp após 3 segundos
        setTimeout(() => {
            if (confirm('Gostaria de continuar a conversa via WhatsApp?')) {
                window.open(whatsappURL, '_blank');
            }
        }, 3000);
        
    }, 2000);
}

// ========================================
// ANIMAÇÕES DE SCROLL
// ========================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .product-card, .gallery-item, .testimonial-card, .contact-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Animações especiais
    initializeCounterAnimations();
    initializeParallaxEffects();
}

function initializeCounterAnimations() {
    // Adicionar contadores se necessário
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    
                    let current = 0;
                    const updateCounter = () => {
                        if (current < target) {
                            current += step;
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                }
            });
        }, { threshold: 0.7 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
}

function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// ========================================
// BACK TO TOP BUTTON
// ========================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// LAZY LOADING DE IMAGENS
// ========================================
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// RECURSOS DE SEO E PERFORMANCE
// ========================================
function initializeSEOFeatures() {
    // Atualizar meta description dinamicamente
    updateMetaDescription();
    
    // Structured data (JSON-LD)
    addStructuredData();
    
    // Preload de recursos críticos
    preloadCriticalResources();
}

function updateMetaDescription() {
    const currentSection = window.location.hash.replace('#', '');
    const metaDescription = document.querySelector('meta[name="description"]');
    
    const descriptions = {
        'about': 'Conheça a história da Viana\'s Pet Shop Passaré. Há mais de 10 anos cuidando dos pets com amor e dedicação.',
        'services': 'Serviços completos para seu pet: banho e tosa, consultas veterinárias, hotel, entrega de ração e mais.',
        'products': 'Produtos premium para pets: rações, brinquedos, acessórios e produtos de higiene. Qualidade garantida.',
        'contact': 'Entre em contato com a Viana\'s Pet Shop Passaré. Estamos no coração do bairro Passaré em Fortaleza.'
    };
    
    if (currentSection && descriptions[currentSection] && metaDescription) {
        metaDescription.setAttribute('content', descriptions[currentSection]);
    }
}

function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "PetStore",
        "name": "Viana's Pet Shop Passaré",
        "description": "Pet shop especializada em cuidados para animais de estimação, localizada no bairro Passaré em Fortaleza",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua das Flores, 123",
            "addressLocality": "Fortaleza",
            "addressRegion": "CE",
            "postalCode": "60743-000",
            "addressCountry": "BR"
        },
        "telephone": "(85) 3234-5678",
        "email": "contato@vianaspetshop.com.br",
        "openingHours": [
            "Mo-Fr 08:00-18:00",
            "Sa 08:00-16:00",
            "Su 08:00-12:00"
        ],
        "priceRange": "$$",
        "image": "assets/logo.png",
        "url": window.location.origin,
        "sameAs": [
            "https://www.facebook.com/vianaspetshop",
            "https://www.instagram.com/vianaspetshop"
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

function preloadCriticalResources() {
    const criticalImages = [
        'assets/hero-pet.jpg',
        'assets/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ========================================
// UTILS E HELPERS
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos inline para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-family: var(--font-secondary);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove após 5 segundos
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Remover ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ========================================
// PERFORMANCE MONITORING
// ========================================
function trackPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
        
        // Send analytics if integrated
        // gtag('event', 'page_load_time', { value: loadTime });
    });
    
    // Track user interactions
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, .nav-link, .service-card')) {
            console.log('Interação:', e.target.textContent?.trim() || e.target.className);
        }
    });
}

// Inicializar monitoramento de performance
trackPerformance();

// ========================================
// SERVICE WORKER (PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch((registrationError) => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', function(e) {
    // Navegação com TAB melhorada
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
    
    // Atalhos de teclado
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Home':
                e.preventDefault();
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'k':
                e.preventDefault();
                // Abrir busca (se implementada no futuro)
                break;
        }
    }
    
    // ESC para fechar modais
    if (e.key === 'Escape') {
        const modal = document.querySelector('.gallery-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
});

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================
function enhanceAccessibility() {
    // Adicionar ARIA labels onde necessário
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.textContent.trim()) {
            button.setAttribute('aria-label', 'Botão de ação');
        }
    });
    
    // Melhorar foco visível
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-orange)';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Inicializar melhorias de acessibilidade
enhanceAccessibility();

// ========================================
// ANALYTICS E TRACKING
// ========================================
function initializeAnalytics() {
    // Placeholder para Google Analytics, Facebook Pixel, etc.
    // gtag('config', 'GA_TRACKING_ID');
    
    // Track scroll depth
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && maxScroll >= milestone) {
                    console.log(`Scroll milestone: ${milestone}%`);
                    // gtag('event', 'scroll', { event_category: 'engagement', value: milestone });
                }
            });
        }
    }, 250));
}

// Utility: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Inicializar analytics
initializeAnalytics();

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
    console.error('Erro na aplicação:', e.error);
    // Opcional: enviar erro para serviço de monitoramento
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejeitada:', e.reason);
    e.preventDefault();
});

// ========================================
// CLEANUP
// ========================================
window.addEventListener('beforeunload', function() {
    // Cleanup quando necessário
    document.body.classList.remove('menu-open');
});