// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Registrar plugins GSAP
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Inicialização de todas as funcionalidades
    initializeNavigation();
    initializeSmoothScrolling();
    initializeProductTabs();
    initializeTestimonialsCarousel();
    initializeContactForm();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeLazyLoading();
    
    // Animações GSAP
    initializeGSAPAnimations();
    
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
    
    // Scroll do header com opacidade gradativa
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Calcular opacidade baseada no scroll (aumenta gradativamente)
        // Começa quase transparente no topo (0.1) e aumenta até 0.7 após 200px de scroll
        const maxScroll = 200;
        const minOpacity = 0.1; // Quase transparente no topo
        const maxOpacity = 0.7; // Mais opaco ao rolar
        
        let opacity;
        if (currentScrollY <= maxScroll) {
            // Interpolação linear: opacidade aumenta conforme o scroll
            opacity = minOpacity + ((currentScrollY / maxScroll) * (maxOpacity - minOpacity));
        } else {
            opacity = maxOpacity;
        }
        
        // Aplicar opacidade ao background
        header.style.background = `rgba(255, 255, 255, ${opacity})`;
        
        // Ajustar blur baseado no scroll também
        const blurAmount = currentScrollY > 100 ? 35 : 30;
        header.style.backdropFilter = `blur(${blurAmount}px)`;
        header.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Header sempre visível, acompanhando o scroll
        header.style.transform = 'translateY(0)';
    });
    
    // Inicializar opacidade no carregamento
    window.addEventListener('load', function() {
        const header = document.querySelector('.header');
        if (window.scrollY === 0) {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
        }
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
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
            
            // Encontra a categoria alvo
            const targetElement = document.getElementById(targetCategory);
            
            if (targetElement) {
                // Anima saída das categorias ativas
                productCategories.forEach(category => {
                    if (category.classList.contains('active') && category !== targetElement) {
                        if (typeof gsap !== 'undefined') {
                            gsap.to(category, {
                                opacity: 0,
                                y: -20,
                                scale: 0.95,
                                duration: 0.3,
                                ease: 'power2.in',
                                onComplete: function() {
                                    category.classList.remove('active');
                                    category.style.display = 'none';
                                }
                            });
                        } else {
                            category.classList.remove('active');
                            category.style.display = 'none';
                        }
                    }
                });
                
                // Anima entrada da categoria alvo
                if (typeof gsap !== 'undefined') {
                    // Prepara para animação
                    targetElement.style.display = 'grid';
                    targetElement.style.opacity = '0';
                    targetElement.style.transform = 'translateY(20px) scale(0.95)';
                    
                    // Força reflow
                    targetElement.offsetHeight;
                    
                    // Anima entrada
                    gsap.to(targetElement, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                        onStart: function() {
                            targetElement.classList.add('active');
                        }
                    });
                    
                    // Anima os cards individuais
                    const productCards = targetElement.querySelectorAll('.product-card');
                    productCards.forEach((card, index) => {
                        gsap.fromTo(card,
                            {
                                opacity: 0,
                                y: 30,
                                scale: 0.9
                            },
                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.4,
                                ease: 'back.out(1.2)',
                                delay: index * 0.1
                            }
                        );
                    });
                } else {
                    // Fallback sem GSAP
                    targetElement.style.display = 'grid';
                    targetElement.style.opacity = '0';
                    targetElement.classList.add('active');
                    
                    setTimeout(() => {
                        targetElement.style.transition = 'opacity 0.5s ease';
                        targetElement.style.opacity = '1';
                    }, 10);
                }
            }
        });
    });
    
    // Inicializar primeira categoria com animação
    const firstCategory = document.querySelector('.product-category.active');
    if (firstCategory) {
        // Garantir que está visível
        if (firstCategory.style.display === 'none' || !firstCategory.style.display) {
            firstCategory.style.display = 'grid';
        }
        
        if (typeof gsap !== 'undefined') {
            // Resetar estado inicial
            gsap.set(firstCategory, { opacity: 1, y: 0, scale: 1 });
            
            const productCards = firstCategory.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 30,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        ease: 'back.out(1.2)',
                        delay: 0.3 + (index * 0.1)
                    }
                );
            });
        } else {
            // Fallback sem GSAP
            firstCategory.style.opacity = '1';
            firstCategory.style.transform = 'translateY(0) scale(1)';
        }
    }
}

// ========================================
// CARROSSEL DE DEPOIMENTOS
// ========================================
function initializeTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentTestimonial = 0;
    let isAnimating = false;
    let autoRotateInterval;
    
    function showTestimonial(index, direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentCard = testimonialCards[currentTestimonial];
        const nextCard = testimonialCards[index];
        
        // Animar saída do card atual
        if (typeof gsap !== 'undefined') {
            gsap.to(currentCard, {
                opacity: 0,
                x: direction === 'next' ? -30 : 30,
                scale: 0.95,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: function() {
                    currentCard.classList.remove('active');
                    currentCard.style.display = 'none';
                    
                    // Animar entrada do próximo card
                    nextCard.style.display = 'block';
                    nextCard.style.visibility = 'visible';
                    nextCard.classList.add('active');
                    
                    // Força reflow
                    nextCard.offsetHeight;
                    
                    gsap.fromTo(nextCard, 
                        {
                            opacity: 0,
                            x: direction === 'next' ? 30 : -30,
                            scale: 0.95,
                            visibility: 'visible'
                        },
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            visibility: 'visible',
                            duration: 0.5,
                            ease: 'power2.out',
                            onComplete: function() {
                                isAnimating = false;
                            }
                        }
                    );
                }
            });
        } else {
            // Fallback sem GSAP
            currentCard.classList.remove('active');
            currentCard.style.display = 'none';
            currentCard.style.visibility = 'hidden';
            
            nextCard.style.display = 'block';
            nextCard.style.visibility = 'visible';
            nextCard.classList.add('active');
            nextCard.style.opacity = '1';
            nextCard.style.transform = 'translateX(0) scale(1)';
            
            isAnimating = false;
        }
        
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(nextIndex, 'next');
        resetAutoRotate();
    }
    
    function prevTestimonial() {
        const prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prevIndex, 'prev');
        resetAutoRotate();
    }
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextTestimonial, 6000);
    }
    
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
        nextBtn.addEventListener('mouseenter', function() {
            clearInterval(autoRotateInterval);
        });
        nextBtn.addEventListener('mouseleave', startAutoRotate);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
        prevBtn.addEventListener('mouseenter', function() {
            clearInterval(autoRotateInterval);
        });
        prevBtn.addEventListener('mouseleave', startAutoRotate);
    }
    
    // Pausar auto-rotate ao passar mouse sobre o carrossel
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            clearInterval(autoRotateInterval);
        });
        
        carousel.addEventListener('mouseleave', startAutoRotate);
        
        // Swipe support para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoRotateInterval);
        });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoRotate();
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
    
    // Inicializar primeiro card corretamente
    if (testimonialCards.length > 0) {
        const firstCard = testimonialCards[0];
        
        // Garantir que o primeiro card está visível
        firstCard.classList.add('active');
        firstCard.style.display = 'block';
        firstCard.style.visibility = 'visible';
        
        // Usar setTimeout para garantir que o DOM está pronto
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                // Resetar estado inicial do primeiro card
                gsap.set(firstCard, { 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    display: 'block',
                    visibility: 'visible'
                });
            } else {
                // Fallback sem GSAP
                firstCard.style.opacity = '1';
                firstCard.style.transform = 'translateX(0) scale(1)';
                firstCard.style.visibility = 'visible';
            }
        }, 100);
        
        // Esconder outros cards
        for (let i = 1; i < testimonialCards.length; i++) {
            testimonialCards[i].classList.remove('active');
            testimonialCards[i].style.display = 'none';
            testimonialCards[i].style.visibility = 'hidden';
            if (typeof gsap !== 'undefined') {
                gsap.set(testimonialCards[i], { 
                    opacity: 0, 
                    x: 30, 
                    scale: 0.95,
                    visibility: 'hidden'
                });
            }
        }
    }
    
    // Iniciar auto-rotate
    startAutoRotate();
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
        const whatsappURL = `https://wa.me/558532950999?text=${encodeURIComponent(message)}`;
        
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
        '.service-card, .product-card, .testimonial-card, .contact-item'
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
        'about': 'Conheça a história da Viana\'s Pet Shop. Há mais de 10 anos cuidando dos pets com amor e dedicação.',
        'services': 'Serviços completos para seu pet: banho e tosa, consultas veterinárias, hotel, entrega de ração e mais.',
        'products': 'Produtos premium para pets: rações, brinquedos, acessórios e produtos de higiene. Qualidade garantida.',
        'contact': 'Entre em contato com a Viana\'s Pet Shop. Estamos prontos para cuidar do seu melhor amigo.'
    };
    
    if (currentSection && descriptions[currentSection] && metaDescription) {
        metaDescription.setAttribute('content', descriptions[currentSection]);
    }
}

function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "PetStore",
        "name": "Viana's Pet Shop",
        "description": "Pet shop especializada em cuidados para animais de estimação em Fortaleza",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "R. Santa Rita das Causas Impossíveis, 631",
            "addressLocality": "Passaré, Fortaleza",
            "addressRegion": "CE",
            "addressCountry": "BR"
        },
        "telephone": "(85) 3295-0999",
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
    
    // ESC para fechar modais (se houver)
    if (e.key === 'Escape') {
        // Fechar modais se existirem
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
// ANIMAÇÕES GSAP
// ========================================
function initializeGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP não carregado. Animações desabilitadas.');
        return;
    }

    // Configuração global do ScrollTrigger
    gsap.config({
        nullTargetWarn: false
    });

    // Animação inicial do Header
    const header = document.querySelector('.header');
    if (header) {
        gsap.set(header, { opacity: 1, y: 0 }); // Garantir visibilidade inicial
        gsap.fromTo(header, 
            { opacity: 0, y: -50 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                immediateRender: false
            }
        );
    }

    // Animação do logo
    const logo = document.querySelector('.logo');
    if (logo) {
        gsap.set(logo, { opacity: 1, scale: 1 }); // Garantir visibilidade inicial
        gsap.fromTo(logo,
            { opacity: 0, scale: 0.5 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.2,
                immediateRender: false
            }
        );
    }

    // Animação do menu de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        gsap.set(link, { opacity: 1, y: 0 }); // Garantir visibilidade inicial
        gsap.fromTo(link,
            { opacity: 0, y: -20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.3 + (index * 0.05),
                immediateRender: false
            }
        );
    });

    // Animação do Hero Section
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    if (heroText) {
        gsap.set(heroText, { opacity: 1, y: 0 }); // Garantir visibilidade inicial
        gsap.fromTo(heroText,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2,
                immediateRender: false
            }
        );
    }
    
    if (heroImage) {
        gsap.set(heroImage, { opacity: 1, x: 0 }); // Garantir visibilidade inicial
        gsap.fromTo(heroImage,
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.4,
                immediateRender: false
            }
        );
    }

    // Animação dos botões do hero
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((btn, index) => {
        gsap.set(btn, { opacity: 1, y: 0 }); // Garantir visibilidade inicial
        gsap.fromTo(btn,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.6 + (index * 0.1),
                immediateRender: false
            }
        );
    });

    // Animação da seção About
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    if (aboutText && aboutImage) {
        gsap.from(aboutText, {
            scrollTrigger: {
                trigger: aboutText,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from(aboutImage, {
            scrollTrigger: {
                trigger: aboutImage,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // Animação dos feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -30,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1
        });
    });

    // Animação da seção Adoption
    const adoptionContent = document.querySelector('.adoption-content');
    if (adoptionContent) {
        gsap.from(adoptionContent, {
            scrollTrigger: {
                trigger: adoptionContent,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // Animação dos event items
    const eventItems = document.querySelectorAll('.event-item');
    eventItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -20,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1
        });
    });

    // Animação dos adoption feature cards
    const adoptionCards = document.querySelectorAll('.adoption-features .feature-card');
    adoptionCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'back.out(1.2)',
            delay: index * 0.15
        });

        // Hover animation
        card.addEventListener('mouseenter', function() {
            gsap.to(card, {
                y: -5,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Animação da seção Services
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
        });

        // Hover animation
        card.addEventListener('mouseenter', function() {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Animação da seção Products
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: 'back.out(1.4)',
            delay: index * 0.08
        });

        // Hover animation
        card.addEventListener('mouseenter', function() {
            gsap.to(card, {
                y: -8,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Animação da seção Testimonials (apenas para o card ativo)
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        const activeCard = document.querySelector('.testimonial-card.active');
        if (activeCard) {
            // Garantir que o card ativo está visível
            gsap.set(activeCard, { opacity: 1, y: 0, x: 0, scale: 1 });
        }
        
        // Animar apenas a seção, não os cards individuais (para não interferir no carrossel)
        gsap.from(testimonialsSection, {
            scrollTrigger: {
                trigger: testimonialsSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Animação da seção Contact
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -30,
            duration: 0.7,
            ease: 'power2.out',
            delay: index * 0.1
        });

        // Hover animation
        item.addEventListener('mouseenter', function() {
            gsap.to(item, {
                x: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', function() {
            gsap.to(item, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: {
                trigger: contactForm,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Animação dos location items
    const locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1
        });

        // Hover animation
        item.addEventListener('mouseenter', function() {
            gsap.to(item, {
                x: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', function() {
            gsap.to(item, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Animação do Section Header
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach((header) => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Animação dos stat cards (se existirem)
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: 'back.out(1.5)',
            delay: index * 0.1
        });

        // Hover animation
        card.addEventListener('mouseenter', function() {
            gsap.to(card, {
                y: -10,
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Animação do Footer
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach((section, index) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1
        });
    });

    // Animação dos tabs de produtos
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn) => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });

    // Animação dos botões em geral
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn) => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });


    // Animação dos ícones sociais
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link) => {
        link.addEventListener('mouseenter', function() {
            gsap.to(link, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        link.addEventListener('mouseleave', function() {
            gsap.to(link, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    });

    // Animação dos controles do carrossel
    const carouselControls = document.querySelectorAll('.prev-btn, .next-btn');
    carouselControls.forEach((btn) => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(btn, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    });

    // Animação do about badge
    const aboutBadge = document.querySelector('.about-badge');
    if (aboutBadge) {
        gsap.from(aboutBadge, {
            scrollTrigger: {
                trigger: aboutBadge,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
    }

    // Animação do adoption image
    const adoptionImage = document.querySelector('.adoption-image img');
    if (adoptionImage) {
        gsap.from(adoptionImage, {
            scrollTrigger: {
                trigger: adoptionImage,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // Animação dos adoption buttons
    const adoptionButtons = document.querySelectorAll('.adoption-buttons .btn');
    adoptionButtons.forEach((btn, index) => {
        gsap.from(btn, {
            scrollTrigger: {
                trigger: btn,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'back.out(1.4)',
            delay: index * 0.1
        });
    });

    // Animação suave do header ao scrollar (usando header já declarado acima)
    if (header) {
        ScrollTrigger.create({
            start: 'top -100',
            end: 99999,
            toggleClass: { className: 'scrolled', targets: header }
        });
    }
}

// ========================================
// CLEANUP
// ========================================
window.addEventListener('beforeunload', function() {
    // Cleanup quando necessário
    document.body.classList.remove('menu-open');
    
    // Limpar ScrollTriggers
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
});