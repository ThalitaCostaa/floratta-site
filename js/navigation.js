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
    if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#')) {
        const isDropdownToggle = anchor.classList.contains('dropdown-toggle');
        const isDropdownItem = anchor.classList.contains('dropdown-item');
        
        if (isDropdownToggle || isDropdownItem) {
            e.preventDefault();
            const hash = anchor.getAttribute('href');

            // 1. Run the correct filter function based on the link clicked
            if (isDropdownToggle) {
                // Main menu links (FLORES or CAFETERIA)
                if (hash === '#floricultura') {
                    showAllProducts();
                } else if (hash === '#cafeteria') {
                    showAllCafeteriaProducts();
                }
            } else if (isDropdownItem) {
                // Specific category links in the dropdown
                const categoryName = anchor.textContent.trim();
                if (hash.includes('cafeteria-category-')) {
                    filterCafeteriaByCategory(categoryName);
                } else {
                    filterProductsByCategory(categoryName);
                }
            }

            // 2. Perform navigation after the filter has been applied
            const navigationAction = () => {
                smoothScrollToAnchor(hash);
                if (history.pushState) {
                    history.pushState(null, null, hash);
                }
            };

            if (isDropdownItem) {
                // For category items, delay slightly to ensure the DOM is updated
                setTimeout(navigationAction, 100);
            } else {
                // For main menu toggles, navigate immediately
                navigationAction();
            }

            // 3. Handle mobile dropdown visibility
            if (isMobileDevice() && isDropdownItem) {
                const dropdown = anchor.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }
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

// Dropdown toggle para mobile
if (isMobileDevice()) {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    });

    // Fechar se clicar fora
    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
}

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