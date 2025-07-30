// Load products from Supabase
async function loadProducts() {
    try {
        console.log('Loading products...');
        
        // Check if supabaseClient is available
        if (typeof supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            throw new Error('Supabase client not available');
        }
        
        const { data: products, error } = await supabaseClient
            .from('products')
            .select(`
                *,
                categories (
                    id,
                    name,
                    type
                )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Products loaded:', products);

        // Load Floricultura products
        await loadFloriculturaProducts(products || []);
        
        // Load Cafeteria products
        await loadCafeteriaProducts(products || []);
    } catch (error) {
        console.error('Error loading products:', error)
        
        // Show user-friendly message
        const productsGrid = document.getElementById('productsGrid')
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>Não foi possível carregar os produtos</h3>
                    <p>Por favor, tente novamente mais tarde.</p>
                    <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Tentar Novamente
                    </button>
                </div>
            `
        }
    }
}

// Load Floricultura products
async function loadFloriculturaProducts(allProducts) {
    const productsGrid = document.getElementById('productsGrid')
    productsGrid.innerHTML = ''
    const floriculturaMenu = document.getElementById('floricultura-menu');
    floriculturaMenu.innerHTML = ''; // Clear existing items

    // Filter products for floricultura (anything not cafeteria)
    const floriculturaProducts = allProducts.filter(p => !p.categories || p.categories.type !== 'cafeteria');

    // Add "Todos os Produtos" link
    /*
    const allProductsLink = document.createElement('a');
    allProductsLink.href = '#floricultura';
    allProductsLink.textContent = 'Todos os Produtos';
    allProductsLink.classList.add('dropdown-item');
    allProductsLink.id = 'show-all-floricultura-link';
    floriculturaMenu.appendChild(allProductsLink);
    */

    // Group products by category
    const productsByCategory = {}
    const uncategorizedProducts = []

    floriculturaProducts.forEach(product => {
        if (product.categories) {
            const categoryName = product.categories.name
            console.log('Product category:', categoryName, product.name);
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = []
            }
            productsByCategory[categoryName].push(product)
        } else {
            console.log('Uncategorized product:', product.name);
            uncategorizedProducts.push(product)
        }
    })

    // Sort categories alphabetically
    const sortedCategories = Object.keys(productsByCategory).sort()
    console.log('Sorted categories:', sortedCategories);

    // Create sections for each category
    sortedCategories.forEach(categoryName => {
        if (productsByCategory[categoryName].length > 0) {
            console.log('Creating category section:', categoryName, 'with', productsByCategory[categoryName].length, 'products');
            createCategorySection(categoryName, productsByCategory[categoryName], productsGrid, 'floricultura');

            // Add category to dropdown menu
            const categoryId = 'category-' + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const link = document.createElement('a');
            link.href = `#${categoryId}`;
            link.textContent = categoryName;
            link.classList.add('dropdown-item'); // Add class for event handling
            floriculturaMenu.appendChild(link);
            console.log('Added category link to menu:', categoryName);
        }
    })

    // Add uncategorized products if any
    if (uncategorizedProducts.length > 0) {
        createCategorySection('Produtos', uncategorizedProducts, productsGrid, 'floricultura')
    }

    // Add quantity button listeners
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input')
            const currentValue = parseInt(input.value)
            
            if(this.textContent === '+') {
                input.value = currentValue + 1
            } else if(currentValue > 1) {
                input.value = currentValue - 1
            }
        })
    })

    // Show floricultura products by default
    hideAllProducts();
}

// Load Cafeteria products
async function loadCafeteriaProducts(allProducts) {
    const cafeteriaGrid = document.getElementById('cafeteriaGrid')
    cafeteriaGrid.innerHTML = ''
    const cafeteriaMenu = document.getElementById('cafeteria-menu');
    cafeteriaMenu.innerHTML = ''; // Clear existing items

    // Filter products for cafeteria
    const cafeteriaProducts = allProducts.filter(p => p.categories && p.categories.type === 'cafeteria');

    // Add "Todos os Produtos" link
    /*
    const allProductsLink = document.createElement('a');
    allProductsLink.href = '#cafeteria';
    allProductsLink.textContent = 'Todos os Produtos';
    allProductsLink.classList.add('dropdown-item');
    allProductsLink.id = 'show-all-cafeteria-link';
    cafeteriaMenu.appendChild(allProductsLink);
    */

    // Group products by category
    const productsByCategory = {}
    const uncategorizedProducts = []

    cafeteriaProducts.forEach(product => {
        if (product.categories) {
            const categoryName = product.categories.name
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = []
            }
            productsByCategory[categoryName].push(product)
        } else {
            uncategorizedProducts.push(product)
        }
    })

    // Sort categories alphabetically
    const sortedCategories = Object.keys(productsByCategory).sort()

    // Create sections for each category
    sortedCategories.forEach(categoryName => {
        if (productsByCategory[categoryName].length > 0) {
            createCategorySection(categoryName, productsByCategory[categoryName], cafeteriaGrid, 'cafeteria');

            // Add category to dropdown menu
            const categoryId = 'cafeteria-category-' + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const link = document.createElement('a');
            link.href = `#${categoryId}`;
            link.textContent = categoryName;
            link.classList.add('dropdown-item'); // Add class for event handling
            cafeteriaMenu.appendChild(link);
        }
    })

    // Show message only if there are no categories with products
    if (sortedCategories.length === 0 && uncategorizedProducts.length === 0) {
        cafeteriaGrid.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h3>Nenhum produto de cafeteria disponível</h3>
                <p>Em breve teremos produtos de cafeteria!</p>
            </div>
        `
    } else if (uncategorizedProducts.length > 0) {
        // Add uncategorized products if any
        createCategorySection('Produtos', uncategorizedProducts, cafeteriaGrid, 'cafeteria')
    }

    // Add quantity button listeners for cafeteria
    document.querySelectorAll('#cafeteriaGrid .quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input')
            const currentValue = parseInt(input.value)
            
            if(this.textContent === '+') {
                input.value = currentValue + 1
            } else if(currentValue > 1) {
                input.value = currentValue - 1
            }
        })
    })
}

// Create category section
function createCategorySection(categoryName, categoryProducts, container, type = 'floricultura') {
    console.log('Creating category section for:', categoryName, 'with', categoryProducts.length, 'products');
    
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.dataset.categoryName = categoryName;

    let categoryId;
    if (type === 'cafeteria') {
        categoryId = 'cafeteria-category-' + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    } else {
        categoryId = 'category-' + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // Create category title
    const categoryTitle = document.createElement('h3')
    categoryTitle.className = 'category-title'
    categoryTitle.textContent = categoryName
    categoryTitle.id = categoryId;
    categorySection.appendChild(categoryTitle)

    // Create products grid for this category
    const categoryGrid = document.createElement('div')
    categoryGrid.className = 'category-products-grid'

    categoryProducts.forEach(product => {
        const productElement = document.createElement('div')
        productElement.className = 'product'
        productElement.innerHTML = `
            <div class="product-image" onclick="openImageModal(this)">
                <img src="${product.image_url}" alt="${product.name}" class="product-img-real">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-quantity">
                    <button class="quantity-btn">-</button>
                    <input type="number" class="quantity-input" value="1" min="1">
                    <button class="quantity-btn">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">Adicionar ao Carrinho</button>
            </div>
        `
        categoryGrid.appendChild(productElement)
    })

    categorySection.appendChild(categoryGrid)
    container.appendChild(categorySection)
    console.log('Category section added to container:', categoryName);
}

function showAllProducts() {
    console.log('Showing all floricultura products...');
    
    // Hide cafeteria section
    const cafeteriaSection = document.getElementById('cafeteria');
    if (cafeteriaSection) {
        cafeteriaSection.style.display = 'none';
        console.log('Cafeteria section hidden');
    }
    
    // Show floricultura section
    const floriculturaSection = document.getElementById('floricultura');
    if (floriculturaSection) {
        floriculturaSection.style.display = 'block';
        console.log('Floricultura section displayed');
    }

    const allCategories = document.querySelectorAll('#productsGrid .category-section');
    console.log('Found', allCategories.length, 'category sections');
    
    const productsTitle = document.getElementById('products-main-title');
    if (productsTitle) productsTitle.style.display = 'block';
    
    allCategories.forEach(categorySection => {
        categorySection.style.display = 'block';
        console.log('Category section displayed:', categorySection.dataset.categoryName);
    });
}

function showAllCafeteriaProducts() {
    console.log('Showing all cafeteria products...');
    
    // Hide floricultura section
    const floriculturaSection = document.getElementById('floricultura');
    if (floriculturaSection) {
        floriculturaSection.style.display = 'none';
        console.log('Floricultura section hidden');
    }
    
    // Show cafeteria section
    const cafeteriaSection = document.getElementById('cafeteria');
    if (cafeteriaSection) {
        cafeteriaSection.style.display = 'block';
        console.log('Cafeteria section displayed');
    }

    const allCategories = document.querySelectorAll('#cafeteriaGrid .category-section');
    const cafeteriaTitle = document.getElementById('cafeteria-main-title');
    if (cafeteriaTitle) cafeteriaTitle.style.display = 'block';
    allCategories.forEach(categorySection => {
        categorySection.style.display = 'block';
    });
}

function filterProductsByCategory(categoryNameToFilter) {
    console.log('Filtering floricultura by category:', categoryNameToFilter);
    
    // Hide cafeteria section
    const cafeteriaSection = document.getElementById('cafeteria');
    if (cafeteriaSection) {
        cafeteriaSection.style.display = 'none';
    }
    
    // Show floricultura section
    const floriculturaSection = document.getElementById('floricultura');
    if (floriculturaSection) floriculturaSection.style.display = 'block';

    const allCategories = document.querySelectorAll('#productsGrid .category-section');
    const productsTitle = document.getElementById('products-main-title');
    
    // Hide main title when a category is selected
    if (productsTitle) productsTitle.style.display = 'none';

    allCategories.forEach(categorySection => {
        if (categorySection.dataset.categoryName === categoryNameToFilter) {
            categorySection.style.display = 'block';
        } else {
            categorySection.style.display = 'none';
        }
    });
}

function filterCafeteriaByCategory(categoryNameToFilter) {
    console.log('Filtering cafeteria by category:', categoryNameToFilter);
    
    // Hide floricultura section
    const floriculturaSection = document.getElementById('floricultura');
    if (floriculturaSection) {
        floriculturaSection.style.display = 'none';
    }
    
    // Show cafeteria section
    const cafeteriaSection = document.getElementById('cafeteria');
    if (cafeteriaSection) cafeteriaSection.style.display = 'block';

    const allCategories = document.querySelectorAll('#cafeteriaGrid .category-section');
    const cafeteriaTitle = document.getElementById('cafeteria-main-title');

    // Hide main title when a category is selected
    if (cafeteriaTitle) cafeteriaTitle.style.display = 'none';
    
    allCategories.forEach(categorySection => {
        if (categorySection.dataset.categoryName === categoryNameToFilter) {
            categorySection.style.display = 'block';
        } else {
            categorySection.style.display = 'none';
        }
    });
}

function hideAllProducts() {
    const floriculturaSection = document.getElementById('floricultura');
    if (floriculturaSection) floriculturaSection.style.display = 'none';
    
    const cafeteriaSection = document.getElementById('cafeteria');
    if (cafeteriaSection) cafeteriaSection.style.display = 'none';
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing products...');
    loadProducts();
}); 