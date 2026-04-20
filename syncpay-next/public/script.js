// Toggle de pacotes de assinatura
document.addEventListener('DOMContentLoaded', function() {
    const packageToggle = document.querySelector('.package-toggle');
    const packagesList = document.querySelector('.packages-list');
    
    if (packageToggle && packagesList) {
        // Inicialmente mostrar os pacotes
        let isOpen = true;
        
        packageToggle.addEventListener('click', function() {
            isOpen = !isOpen;
            
            if (isOpen) {
                packagesList.style.display = 'flex';
                packageToggle.querySelector('i').className = 'fas fa-chevron-up';
            } else {
                packagesList.style.display = 'none';
                packageToggle.querySelector('i').className = 'fas fa-chevron-down';
            }
        });
    }
    
    // Adicionar animação suave ao scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Sistema de Tabs (POSTAGENS / MÍDIA)
    const tabs = document.querySelectorAll('.tab');
    const postsContent = document.getElementById('postsContent');
    const mediaContent = document.getElementById('mediaContent');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adiciona active na tab clicada
            this.classList.add('active');
            
            // Alterna o conteúdo
            if (index === 0) {
                // Tab POSTAGENS
                postsContent.classList.remove('hidden');
                mediaContent.classList.add('hidden');
            } else {
                // Tab MÍDIA
                postsContent.classList.add('hidden');
                mediaContent.classList.remove('hidden');
            }
        });
    });
    
    // Autoplay de vídeos na grade ao passar o mouse
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        const video = item.querySelector('video');
        
        if (video) {
            // Play ao passar o mouse
            item.addEventListener('mouseenter', () => {
                video.play().catch(err => console.log('Erro ao reproduzir:', err));
            });
            
            // Pause ao tirar o mouse
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; // Volta ao início
            });
        }
    });
    
    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animação aos cards
    const animatedElements = document.querySelectorAll('.subscription-section, .locked-content, .subscription-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Adicionar efeito de ripple nos botões
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Adicionar contador de likes animado
    const likeCount = document.querySelector('.profile-header-stats .stat-item:last-child');
    if (likeCount) {
        let count = 0;
        const target = 193100;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                const formatted = (count / 1000).toFixed(1) + 'K';
                requestAnimationFrame(updateCount);
            } else {
                const formatted = '193.1K';
            }
        };
        
        // Comentado para não sobrescrever o HTML
        // updateCount();
    }
    
    // Adicionar efeito parallax no banner
    const banner = document.querySelector('.profile-banner img');
    if (banner) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            banner.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
    
    // Notificações toast (exemplo)
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--primary-blue), #0095d4);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Adicionar CSS para ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translate(-50%, 100px);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        
        @keyframes slideDown {
            from {
                transform: translate(-50%, 0);
                opacity: 1;
            }
            to {
                transform: translate(-50%, 100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    
    // Sistema de favoritos
    const starBtns = document.querySelectorAll('.icon-btn .fa-star');
    starBtns.forEach(btn => {
        btn.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            if (btn.classList.contains('far')) {
                btn.classList.remove('far');
                btn.classList.add('fas');
                btn.style.color = '#FFD700';
                showToast('Adicionado aos favoritos! ⭐');
            } else {
                btn.classList.remove('fas');
                btn.classList.add('far');
                btn.style.color = '';
                showToast('Removido dos favoritos');
            }
        });
    });
    
    // Área bloqueada: prévia em vídeo
    // Garante que o vídeo carregue e comece a tocar
    const videoElement = document.querySelector('.preview-video video');
    if (videoElement) {
        videoElement.load();
        
        // Tenta dar play automaticamente
        videoElement.play().catch(err => {
            console.log('Autoplay bloqueado, aguardando interação:', err);
        });
        
        // Play ao passar o mouse (hover)
        const lockedContent = document.getElementById('lockedContent');
        if (lockedContent) {
            lockedContent.addEventListener('mouseenter', () => {
                videoElement.play().catch(err => console.log('Erro ao dar play:', err));
            });
        }
        
        // Play ao clicar em qualquer lugar da área
        if (lockedContent) {
            lockedContent.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                }
            });
        }
        
        // Debug: verifica se o vídeo está carregando
        videoElement.addEventListener('loadeddata', () => {
            console.log('Vídeo carregado com sucesso!');
            // Força o play quando carregar
            videoElement.play().catch(() => {});
        });
        
        videoElement.addEventListener('error', (e) => {
            console.error('Erro ao carregar vídeo:', e);
        });
        
        videoElement.addEventListener('playing', () => {
            console.log('Vídeo está tocando!');
        });
    }
});

// Função para formatar números
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Atualizar contadores dinamicamente
function updateStats() {
    const stats = {
        photos: 388,
        videos: 67,
        streams: 33,
        likes: 193100
    };
    
    // Aqui você pode adicionar lógica para atualizar dinamicamente
}

// Listener para o botão de voltar
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
    backBtn.addEventListener('click', function() {
        window.history.back();
    });
}

// Listener para o botão de ajuda
const helpBtn = document.querySelector('.help-btn');
if (helpBtn) {
    helpBtn.addEventListener('click', function() {
        alert('Como podemos ajudar você?');
    });
}

function abrirCheckoutModal(plano) {
    var p = plano || 'Mensal';
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'onlyfans-checkout', plano: p }, '*');
    } else {
        window.location.href = '/?plano=' + encodeURIComponent(p);
    }
}

function initSubscriptionButtons() {
    var map = [
        ['subscribeMonthly', 'Mensal'],
        ['subscribeQuarterly', 'Trimestral'],
        ['subscribeYearly', 'Anual'],
        ['subscribeSidebar', 'Mensal'],
        ['unlockBtn', 'Mensal']
    ];
    map.forEach(function (pair) {
        var el = document.getElementById(pair[0]);
        if (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                abrirCheckoutModal(pair[1]);
            });
        }
    });
}

window.addEventListener('load', function () {
    initSubscriptionButtons();
});

