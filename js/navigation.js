// Função para smooth scroll para âncoras
function smoothScrollToAnchor(hash) {
    const targetElement = document.querySelector(hash);
    if (targetElement) {
        // Calcular offset do header fixo
        const headerHeight = document.querySelector('header').offsetHeight;
        const offsetTop = targetElement.offsetTop - headerHeight - 20; // 20px de margem extra
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Adicionar listener para links âncora dentro da página
document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a');
    if (!anchor || !anchor.getAttribute('href') || !anchor.getAttribute('href').startsWith('#')) {
        return;
    }

    const href = anchor.getAttribute('href');
    const onFloriculturaPage = window.location.pathname.includes('floricultura.html');
    const onCafeteriaPage = window.location.pathname.includes('cafeteria.html');
    const onHomeDecorPage = window.location.pathname.includes('home-decor.html');

    // Handle clicks on main menu toggles (FLORES/CAFETERIA/HOME DECOR)
    if (href === '#floricultura' || href === '#cafeteria' || href === '#home-decor') {
        // Don't show products when clicking main menu items
        // Just allow normal navigation to the correct page
        return; 
    }

    // Handle clicks on category dropdown items
    if (href.startsWith('#category-') || href.startsWith('#cafeteria-category-') || href.startsWith('#home-decor-category-')) {
        e.preventDefault();
        const isFloriculturaCategory = href.startsWith('#category-');
        const isCafeteriaCategory = href.startsWith('#cafeteria-category-');
        const isHomeDecorCategory = href.startsWith('#home-decor-category-');

        if (isFloriculturaCategory && !onFloriculturaPage) {
            // From other page to floricultura page with category filter
            window.location.href = 'floricultura.html' + href;
        } else if (isCafeteriaCategory && !onCafeteriaPage) {
            // From other page to cafeteria page with category filter
            window.location.href = 'cafeteria.html' + href;
        } else if (isHomeDecorCategory && !onHomeDecorPage) {
            // From other page to home decor page with category filter
            window.location.href = 'home-decor.html' + href;
        } else if (isFloriculturaCategory && (onCafeteriaPage || onHomeDecorPage)) {
            // From cafeteria/home-decor to floricultura page with category filter
            window.location.href = 'floricultura.html' + href;
        } else if (isCafeteriaCategory && (onFloriculturaPage || onHomeDecorPage)) {
            // From floricultura/home-decor to cafeteria page with category filter
            window.location.href = 'cafeteria.html' + href;
        } else if (isHomeDecorCategory && (onFloriculturaPage || onCafeteriaPage)) {
            // From floricultura/cafeteria to home-decor page with category filter
            window.location.href = 'home-decor.html' + href;
        } else {
            // Filter on the same page
            const categoryName = anchor.textContent.trim();
            if (isCafeteriaCategory) {
                filterCafeteriaByCategory(categoryName);
            } else if (isHomeDecorCategory) {
                filterHomeDecorByCategory(categoryName);
            } else {
                filterProductsByCategory(categoryName);
            }
            smoothScrollToAnchor(href);
        }
    }
});

// Listener para mudanças na URL (quando vem de outras páginas)
window.addEventListener('hashchange', function() {
    if (window.location.hash) {
        // Pequeno delay para garantir que a página esteja pronta
        setTimeout(() => {
            smoothScrollToAnchor(window.location.hash);
        }, 100);
    }
});

// Dropdown toggle para mobile (desabilitado - usar mobile-menu.js em vez disso)
// O menu mobile é gerenciado pelo mobile-menu.js para melhor UX
// if (isMobileDevice()) {
//     const dropdowns = document.querySelectorAll('.dropdown');
//     
//     dropdowns.forEach(dropdown => {
//         const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

//         dropdownToggle.addEventListener('click', function(e) {
//             e.preventDefault();
//             dropdown.classList.toggle('active');
//         });
//     });

//     // Fechar se clicar fora
//     document.addEventListener('click', function(e) {
//         dropdowns.forEach(dropdown => {
//             if (!dropdown.contains(e.target)) {
//                 dropdown.classList.remove('active');
//             }
//         });
//     });
// }

// Desktop dropdown hover
if (!isMobileDevice()) {
    document.addEventListener('DOMContentLoaded', function() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                this.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        });
    });
}

// Function to detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
} 