// ============================================
// CONFIGURAÇÃO DO LINK DE ENTREGA
// ============================================
// Altere o link abaixo para o seu produto/conteúdo
const DELIVERY_CONFIG = {
    // Link padrão para todos os planos
    defaultLink: 'https://www.example.com/seu-conteudo',
    
    // Ou links diferentes por plano (opcional)
    planLinks: {
        'Mensal': 'https://www.example.com/mensal',
        'Trimestral': 'https://www.example.com/trimestral',
        'Anual': 'https://www.example.com/anual'
    },
    
    // Usar links específicos por plano? (true/false)
    usePlanSpecificLinks: false
};

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
    
    // Sistema de desbloqueio de conteúdo
    const unlockBtn = document.getElementById('unlockBtn');
    const lockOverlay = document.getElementById('lockOverlay');
    const previewVideo = document.getElementById('previewVideo');
    
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
    
    // Desbloqueio do conteúdo só após pagamento confirmado (ver irParaAgradecimentoComEntrega)
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

// ============================================
// PAGAMENTO PIX — só requisições HTTP (sem página de checkout)
// POST /api/payment/create + polling GET /api/payment/status no modal abaixo
// ============================================
// URL do servidor Next (syncpay-next). Ajuste se necessário.
const PAYMENT_API = {
    baseUrl: 'http://localhost:3000',
    /** Dados do comprador — SyncPay exige client.cpf (11) e client.phone (10–11) */
    customer: {
        name: 'Cliente',
        email: 'cliente@localhost.test',
        document: '52998224725',
        phone: '11999999999'
    }
};

const PLANOS = {
    'Mensal': { preco: 19.90, amountCents: 1990, duracao: '1 mês', dias: 31 },
    'Trimestral': { preco: 50.00, amountCents: 5000, duracao: '3 meses', dias: 90 },
    'Anual': { preco: 99.90, amountCents: 9990, duracao: '12 meses', dias: 365 }
};

let timerInterval = null;
let statusPollInterval = null;
let pagamentoIdentifierAtual = null;

function pararPollingStatus() {
    if (statusPollInterval) {
        clearInterval(statusPollInterval);
        statusPollInterval = null;
    }
}

function resetModalPixLoading() {
    const qrContainer = document.getElementById('qrCode');
    if (qrContainer) {
        qrContainer.innerHTML = `
            <div class="loading-qr">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Gerando QR Code...</p>
            </div>
        `;
    }
    const pixInput = document.getElementById('pixCodeInput');
    if (pixInput) pixInput.value = '';
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
        statusDiv.innerHTML = '<i class="fas fa-clock"></i><span>Aguardando pagamento...</span>';
    }
}

function exibirQrCodeNoModal(base64OuDataUrl) {
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer || !base64OuDataUrl) return;
    const src = base64OuDataUrl.startsWith('data:')
        ? base64OuDataUrl
        : `data:image/png;base64,${base64OuDataUrl}`;
    qrContainer.innerHTML = `<img src="${src}" alt="QR Code PIX" style="max-width:240px;height:auto;display:block;margin:0 auto;" />`;
}

function exibirCodigoPixInput(codigo) {
    const input = document.getElementById('pixCodeInput');
    if (input) input.value = codigo || '';
}

// Abrir modal de pagamento
function openPaymentModal(planName) {
    const plano = PLANOS[planName];
    const modal = document.getElementById('paymentModal');
    const planInfo = document.getElementById('paymentPlanInfo');
    const modalContent = modal.querySelector('.payment-modal-content');

    window.__planoPagamentoAtual = planName;

    planInfo.textContent = `${plano.duracao} - R$ ${plano.preco.toFixed(2).replace('.', ',')}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    pararPollingStatus();
    pagamentoIdentifierAtual = null;
    resetModalPixLoading();

    if (modalContent) {
        modalContent.addEventListener('scroll', handleModalScroll);
        setTimeout(() => handleModalScroll.call(modalContent), 100);
    }

    criarPixPagamento();
    iniciarTimer(900);
}

// Detectar scroll no modal
function handleModalScroll() {
    if (this.scrollTop > 20) {
        this.classList.add('has-scroll');
    } else {
        this.classList.remove('has-scroll');
    }
}

// Fechar modal de pagamento
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const modalContent = modal.querySelector('.payment-modal-content');
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remover listener de scroll
    if (modalContent) {
        modalContent.removeEventListener('scroll', handleModalScroll);
        modalContent.classList.remove('has-scroll');
    }
    
    pararPollingStatus();
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

async function criarPixPagamento() {
    try {
        const planName = window.__planoPagamentoAtual || 'Mensal';
        const plano = PLANOS[planName];
        if (!plano) throw new Error('Plano inválido');

        resetModalPixLoading();

        const res = await fetch(`${PAYMENT_API.baseUrl}/api/payment/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amountCents: plano.amountCents,
                description: `Assinatura — ${plano.duracao}`,
                recode: planName,
                customer: PAYMENT_API.customer
            })
        });

        const rawText = await res.text();
        let dados = {};
        try {
            dados = rawText ? JSON.parse(rawText) : {};
        } catch {
            throw new Error(rawText || ('HTTP ' + res.status));
        }
        if (!res.ok || dados.error) {
            const det = dados.details ? ' ' + JSON.stringify(dados.details) : '';
            throw new Error((dados.error || 'Falha ao criar cobrança') + det);
        }

        pagamentoIdentifierAtual = dados.identifier;
        exibirCodigoPixInput(dados.pixCode);
        if (dados.qrCodeBase64) {
            exibirQrCodeNoModal(dados.qrCodeBase64);
        }

        iniciarPollingStatusPagamento();
    } catch (error) {
        console.error('Erro ao criar PIX:', error);
        
        // Mostrar erro no modal
        const qrContainer = document.getElementById('qrCode');
        qrContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao gerar QR Code</p>
                <p class="error-details">${error.message}</p>
                <button onclick="criarPixPagamento()" class="retry-btn">Tentar Novamente</button>
            </div>
        `;
    }
}

function iniciarPollingStatusPagamento() {
    pararPollingStatus();
    if (!pagamentoIdentifierAtual) return;

    const tick = async () => {
        try {
            const res = await fetch(
                `${PAYMENT_API.baseUrl}/api/payment/status?identifier=${encodeURIComponent(pagamentoIdentifierAtual)}`
            );
            const data = await res.json();
            if (!res.ok || data.error) return;

            if (data.status === 'paid' && data.delivery) {
                pararPollingStatus();
                irParaAgradecimentoComEntrega(data);
            }
        } catch (e) {
            console.warn('Polling status:', e);
        }
    };

    tick();
    statusPollInterval = setInterval(tick, 3000);
}

function irParaAgradecimentoComEntrega(statusPayload) {
    const planName = window.__planoPagamentoAtual || 'Mensal';
    const plano = PLANOS[planName];
    const valorStr = plano
        ? plano.preco.toFixed(2).replace('.', ',')
        : ((statusPayload.amountCents || 0) / 100).toFixed(2).replace('.', ',');

    const linkEntrega =
        (statusPayload.delivery && statusPayload.delivery.content) ||
        (DELIVERY_CONFIG.usePlanSpecificLinks
            ? DELIVERY_CONFIG.planLinks[planName]
            : DELIVERY_CONFIG.defaultLink);

    closePaymentModal();

    const params = new URLSearchParams({
        id: statusPayload.identifier || pagamentoIdentifierAtual || '',
        valor: valorStr,
        plano: planName,
        status: 'paid',
        timestamp: new Date().toISOString(),
        link: linkEntrega
    });

    window.location.href = `agradecimento.html?${params.toString()}`;
}

// Timer de expiração
function iniciarTimer(segundos) {
    let tempoRestante = segundos;
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        tempoRestante--;
        
        const minutos = Math.floor(tempoRestante / 60);
        const segs = tempoRestante % 60;
        timerDisplay.textContent = `${minutos}:${segs.toString().padStart(2, '0')}`;
        
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            pixExpirado();
        }
    }, 1000);
}

// PIX expirado
function pixExpirado() {
    const statusDiv = document.getElementById('paymentStatus');
    statusDiv.innerHTML = `
        <i class="fas fa-times-circle" style="color: #ff4444;"></i>
        <span style="color: #ff4444;">PIX expirado. Gere um novo.</span>
    `;
    
    // Mostrar botão para gerar novo PIX
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = `
        <div class="expired-message">
            <i class="fas fa-clock"></i>
            <p>QR Code expirado</p>
            <button onclick="criarPixPagamento()" class="retry-btn">Gerar Novo PIX</button>
        </div>
    `;
}

// Copiar código PIX
function copiarCodigoPix() {
    const input = document.getElementById('pixCodeInput');
    input.select();
    document.execCommand('copy');
    
    const btn = document.getElementById('copyPixBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    btn.style.backgroundColor = '#4ade80';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
    }, 2000);
}

// Inicializar botões de assinatura
function initSubscriptionButtons() {
    // Botão Mensal - Main
    const monthlyBtn = document.getElementById('subscribeMonthly');
    if (monthlyBtn) {
        monthlyBtn.addEventListener('click', function() {
            openPaymentModal('Mensal');
        });
    }
    
    // Botão Trimestral
    const quarterlyBtn = document.getElementById('subscribeQuarterly');
    if (quarterlyBtn) {
        quarterlyBtn.addEventListener('click', function() {
            openPaymentModal('Trimestral');
        });
    }
    
    // Botão Anual
    const yearlyBtn = document.getElementById('subscribeYearly');
    if (yearlyBtn) {
        yearlyBtn.addEventListener('click', function() {
            openPaymentModal('Anual');
        });
    }
    
    // Botão Sidebar
    const sidebarBtn = document.getElementById('subscribeSidebar');
    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', function() {
            openPaymentModal('Mensal');
        });
    }
    
    // Botão "INSCREVE-TE" da área bloqueada
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', function() {
            openPaymentModal('Mensal');
        });
    }
    
    // Botão de fechar modal
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
    
    // Botão de copiar código PIX
    const copyBtn = document.getElementById('copyPixBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copiarCodigoPix);
    }
    
    // Clicar fora do modal para fechar
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', function() {
    initSubscriptionButtons();
});

