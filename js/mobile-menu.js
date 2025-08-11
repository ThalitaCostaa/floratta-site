// Mobile Menu Sidebar Controller
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu mobile
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    // Função para abrir o menu
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileSidebar.classList.add('active');
        mobileSidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede scroll da página
    }

    // Função para fechar o menu
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileSidebar.classList.remove('active');
        mobileSidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll da página
        
        // Fechar todos os dropdowns abertos
        mobileDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    // Event listeners para abrir/fechar menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileSidebar.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Botão de fechar removido - agora só fecha pelo hambúrguer, overlay ou ESC

    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }

    // Controle dos dropdowns mobile
    mobileDropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.mobile-dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyActive = dropdown.classList.contains('active');
                const clickedElement = e.target;
                
                // Se clicou no span de texto (não no ícone), verificar se deve navegar
                if (clickedElement.tagName === 'SPAN') {
                    const href = dropdownToggle.getAttribute('href');
                    const text = clickedElement.textContent.trim();
                    
                    // Se é FLORES, CAFETERIA ou HOME DECOR e não tem categorias ainda, navegar
                    if ((text === 'FLORES' || text === 'CAFETERIA' || text === 'HOME DECOR') && href && href !== '#') {
                        let menuId;
                        if (text === 'FLORES') menuId = 'mobile-floricultura-menu';
                        else if (text === 'CAFETERIA') menuId = 'mobile-cafeteria-menu';
                        else if (text === 'HOME DECOR') menuId = 'mobile-home-decor-menu';
                        
                        const menu = document.getElementById(menuId);
                        
                        // Se não tem categorias carregadas, navegar para a página
                        if (!menu || menu.children.length === 0) {
                            closeMobileMenu();
                            window.location.href = href;
                            return;
                        }
                    }
                }
                
                // Fechar todos os dropdowns primeiro
                mobileDropdowns.forEach(otherDropdown => {
                    otherDropdown.classList.remove('active');
                });
                
                // Se não estava ativo, ativar o atual
                if (!isCurrentlyActive) {
                    dropdown.classList.add('active');
                }
            });
        }
    });

    // Fechar menu quando clicar em link direto (não dropdown)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Delay para permitir navegação antes de fechar
            setTimeout(closeMobileMenu, 100);
        });
    });

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Carregar categorias nos dropdowns mobile
    function loadMobileCategorias() {
        // Aguardar produtos serem carregados
        const checkAndLoadCategories = () => {
            const floriculturaMenu = document.getElementById('floricultura-menu');
            const cafeteriaMenu = document.getElementById('cafeteria-menu');
            const homeDecorMenu = document.getElementById('home-decor-menu');

            // Floricultura - copiar do menu desktop
            if (floriculturaMenu && floriculturaMenu.children.length > 0) {
                const mobileFloriculturaMenu = document.getElementById('mobile-floricultura-menu');
                if (mobileFloriculturaMenu) {
                    mobileFloriculturaMenu.innerHTML = '';
                    Array.from(floriculturaMenu.children).forEach(item => {
                        const link = document.createElement('a');
                        link.href = item.href;
                        link.textContent = item.textContent;
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const categoryName = item.textContent.trim();
                            
                            // Verificar se estamos na página de floricultura
                            if (window.location.pathname.includes('floricultura.html')) {
                                // Se estamos na página de floricultura, filtrar por categoria
                                if (typeof filterProductsByCategory === 'function') {
                                    filterProductsByCategory(categoryName);
                                }
                            } else {
                                // Se não estamos na página de floricultura, navegar para ela
                                window.location.href = 'floricultura.html' + item.getAttribute('href');
                            }
                            
                            closeMobileMenu();
                            
                            // Scroll para produtos após fechar menu (se na mesma página)
                            if (window.location.pathname.includes('floricultura.html')) {
                                setTimeout(() => {
                                    const floriculturaSection = document.querySelector('#floricultura');
                                    if (floriculturaSection) {
                                        floriculturaSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, 300);
                            }
                        });
                        mobileFloriculturaMenu.appendChild(link);
                    });
                }
            }

            // Cafeteria - copiar do menu desktop
            if (cafeteriaMenu && cafeteriaMenu.children.length > 0) {
                const mobileCafeteriaMenu = document.getElementById('mobile-cafeteria-menu');
                if (mobileCafeteriaMenu) {
                    mobileCafeteriaMenu.innerHTML = '';
                    Array.from(cafeteriaMenu.children).forEach(item => {
                        const link = document.createElement('a');
                        link.href = item.href;
                        link.textContent = item.textContent;
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const categoryName = item.textContent.trim();
                            
                            // Verificar se estamos na página de cafeteria
                            if (window.location.pathname.includes('cafeteria.html')) {
                                // Se estamos na página de cafeteria, filtrar por categoria
                                if (typeof filterCafeteriaByCategory === 'function') {
                                    filterCafeteriaByCategory(categoryName);
                                }
                            } else {
                                // Se não estamos na página de cafeteria, navegar para ela
                                window.location.href = 'cafeteria.html' + item.getAttribute('href');
                            }
                            
                            closeMobileMenu();
                            
                            // Scroll para produtos após fechar menu (se na mesma página)
                            if (window.location.pathname.includes('cafeteria.html')) {
                                setTimeout(() => {
                                    const cafeteriaSection = document.querySelector('#cafeteria');
                                    if (cafeteriaSection) {
                                        cafeteriaSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, 300);
                            }
                        });
                        mobileCafeteriaMenu.appendChild(link);
                    });
                }
            }

            // Home Decor - copiar do menu desktop
            if (homeDecorMenu && homeDecorMenu.children.length > 0) {
                const mobileHomeDecorMenu = document.getElementById('mobile-home-decor-menu');
                if (mobileHomeDecorMenu) {
                    mobileHomeDecorMenu.innerHTML = '';
                    Array.from(homeDecorMenu.children).forEach(item => {
                        const link = document.createElement('a');
                        link.href = item.href;
                        link.textContent = item.textContent;
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const categoryName = item.textContent.trim();
                            
                            // Verificar se estamos na página de home decor
                            if (window.location.pathname.includes('home-decor.html')) {
                                // Se estamos na página de home decor, filtrar por categoria
                                if (typeof filterHomeDecorByCategory === 'function') {
                                    filterHomeDecorByCategory(categoryName);
                                }
                            } else {
                                // Se não estamos na página de home decor, navegar para ela
                                window.location.href = 'home-decor.html' + item.getAttribute('href');
                            }
                            
                            closeMobileMenu();
                            
                            // Scroll para produtos após fechar menu (se na mesma página)
                            if (window.location.pathname.includes('home-decor.html')) {
                                setTimeout(() => {
                                    const homeDecorSection = document.querySelector('#home-decor');
                                    if (homeDecorSection) {
                                        homeDecorSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, 300);
                            }
                        });
                        mobileHomeDecorMenu.appendChild(link);
                    });
                }
            }
        };

        // Tentar carregar imediatamente
        checkAndLoadCategories();
        
        // Tentar novamente após 1 segundo se não tiver carregado
        setTimeout(checkAndLoadCategories, 1000);
        
        // Tentar mais uma vez após 2 segundos para garantir
        setTimeout(checkAndLoadCategories, 2000);
        
        // Observar mudanças nos menus desktop para atualizar mobile
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    checkAndLoadCategories();
                }
            });
        });

        // Observar mudanças nos menus desktop
        ['floricultura-menu', 'cafeteria-menu', 'home-decor-menu'].forEach(menuId => {
            const menu = document.getElementById(menuId);
            if (menu) {
                observer.observe(menu, { childList: true });
            }
        });
    }

    // Carregar categorias quando o menu é carregado
    setTimeout(loadMobileCategorias, 100);
    
    // Expor função globalmente para debug e uso manual
    window.loadMobileCategorias = loadMobileCategorias;

    // Redimensionamento da janela
    window.addEventListener('resize', function() {
        // Fechar menu se mudou para desktop
        if (window.innerWidth > 768 && mobileSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});