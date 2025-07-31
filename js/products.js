// Load products from Supabase
async function loadProducts() {
    try {
        console.log(`Loading all products...`);
        
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
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('All products loaded:', products);

        // Populate both menus on every page
        await loadFloriculturaProducts(products || []);
        await loadCafeteriaProducts(products || []);

        // Apply filter from URL if present
        applyFilterFromURL();

    } catch (error) {
        console.error('Error loading products:', error);
        
        const productsGrid = document.getElementById('productsGrid');
        const cafeteriaGrid = document.getElementById('cafeteriaGrid');

        const errorMessage = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h3>Não foi possível carregar os produtos</h3>
                <p>Por favor, tente novamente mais tarde.</p>
                <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Tentar Novamente
                </button>
            </div>
        `;

        if (productsGrid) {
            productsGrid.innerHTML = errorMessage;
        }
        if (cafeteriaGrid) {
            cafeteriaGrid.innerHTML = errorMessage;
        }
    }
}

// Load Floricultura products
async function loadFloriculturaProducts(allProducts) {
    const floriculturaMenu = document.getElementById('floricultura-menu');
    if (floriculturaMenu) {
        floriculturaMenu.innerHTML = ''; // Clear existing items
    }

    const floriculturaProducts = allProducts.filter(p => !p.categories || p.categories.type !== 'cafeteria');
    const productsByCategory = {};
    const uncategorizedProducts = [];

    floriculturaProducts.forEach(product => {
        if (product.categories) {
            const categoryName = product.categories.name;
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = [];
            }
            productsByCategory[categoryName].push(product);
        } else {
            uncategorizedProducts.push(product);
        }
    });

    const sortedCategories = Object.keys(productsByCategory).sort();

    sortedCategories.forEach(categoryName => {
        if (productsByCategory[categoryName].length > 0) {
            // Add category to dropdown menu
            if (floriculturaMenu) {
                const categoryId = 'category-' + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const link = document.createElement('a');
                link.href = `#${categoryId}`;
                link.textContent = categoryName;
                link.classList.add('dropdown-item');
                floriculturaMenu.appendChild(link);
            }
        }
    });

    // Only render products if the grid exists on the current page
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        sortedCategories.forEach(categoryName => {
            if (productsByCategory[categoryName].length > 0) {
                createCategorySection(categoryName, productsByCategory[categoryName], productsGrid, 'floricultura');
            }
        });

        if (uncategorizedProducts.length > 0) {
            createCategorySection('Produtos', uncategorizedProducts, productsGrid, 'floricultura');
        }
        
        // Add quantity button listeners
        document.querySelectorAll('#productsGrid .quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                const currentValue = parseInt(input.value);
                if(this.textContent === '+') {
                    input.value = currentValue + 1;
                } else if(currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });
        });
    }
}

// Load Cafeteria products
async function loadCafeteriaProducts(allProducts) {
    const cafeteriaMenu = document.getElementById('cafeteria-menu');
    if (cafeteriaMenu) {
        cafeteriaMenu.innerHTML = ''; // Clear existing items
    }

    const cafeteriaProducts = allProducts.filter(p => p.categories && p.categories.type === 'cafeteria');
    const productsByCategory = {};
    const uncategorizedProducts = [];

    cafeteriaProducts.forEach(product => {
        if (product.categories) {
            const categoryName = product.categories.name;
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = [];
            }
            productsByCategory[categoryName].push(product);
        } else {
            uncategorizedProducts.push(product);
        }
    });

    const sortedCategories = Object.keys(productsByCategory).sort();

    sortedCategories.forEach(categoryName => {
        if (productsByCategory[categoryName].length > 0) {
            // Add category to dropdown menu
            if (cafeteriaMenu) {
                const categoryId = 'cafeteria-category-' + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const link = document.createElement('a');
                link.href = `#${categoryId}`;
                link.textContent = categoryName;
                link.classList.add('dropdown-item');
                cafeteriaMenu.appendChild(link);
            }
        }
    });

    // Only render products if the grid exists on the current page
    const cafeteriaGrid = document.getElementById('cafeteriaGrid');
    if (cafeteriaGrid) {
        cafeteriaGrid.innerHTML = '';

        if (sortedCategories.length === 0 && uncategorizedProducts.length === 0) {
            cafeteriaGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>Nenhum produto de cafeteria disponível</h3>
                    <p>Em breve teremos produtos de cafeteria!</p>
                </div>
            `;
        } else {
            sortedCategories.forEach(categoryName => {
                if (productsByCategory[categoryName].length > 0) {
                    createCategorySection(categoryName, productsByCategory[categoryName], cafeteriaGrid, 'cafeteria');
                }
            });

            if (uncategorizedProducts.length > 0) {
                createCategorySection('Produtos', uncategorizedProducts, cafeteriaGrid, 'cafeteria');
            }
        }
        
        // Add quantity button listeners
        document.querySelectorAll('#cafeteriaGrid .quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                const currentValue = parseInt(input.value);
                if(this.textContent === '+') {
                    input.value = currentValue + 1;
                } else if(currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });
        });
    }
}

// Create category section
function createCategorySection(categoryName, categoryProducts, container, type = 'floricultura') {
    console.log('Creating category section for:', categoryName, 'with', categoryProducts.length, 'products');
    
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    // Store both original name and normalized name for better matching
    categorySection.dataset.categoryName = categoryName;
    categorySection.dataset.normalizedName = categoryName.toLowerCase().trim();

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
    const allCategories = document.querySelectorAll('#productsGrid .category-section');
    const productsTitle = document.getElementById('products-main-title');
    if (productsTitle) productsTitle.style.display = 'block';
    
    allCategories.forEach(categorySection => {
        categorySection.style.display = 'block';
    });
}

function showAllCafeteriaProducts() {
    const allCategories = document.querySelectorAll('#cafeteriaGrid .category-section');
    const cafeteriaTitle = document.getElementById('cafeteria-main-title');
    if (cafeteriaTitle) cafeteriaTitle.style.display = 'block';

    allCategories.forEach(categorySection => {
        categorySection.style.display = 'block';
    });
}

function filterProductsByCategory(categoryNameToFilter) {
    console.log('Filtering products by category:', categoryNameToFilter);
    const allCategories = document.querySelectorAll('#productsGrid .category-section');
    const productsTitle = document.getElementById('products-main-title');
    
    console.log('Found categories:', allCategories.length);
    allCategories.forEach((section, index) => {
        console.log(`Category ${index}:`, section.dataset.categoryName);
    });
    
    if (productsTitle) productsTitle.style.display = 'none';

    const normalizedFilter = categoryNameToFilter.toLowerCase().trim();
    let foundMatch = false;
    
    allCategories.forEach(categorySection => {
        const categoryName = categorySection.dataset.categoryName;
        const normalizedName = categorySection.dataset.normalizedName || categoryName.toLowerCase().trim();
        
        // Try multiple matching strategies
        const exactMatch = categoryName === categoryNameToFilter;
        const normalizedMatch = normalizedName === normalizedFilter;
        const containsMatch = categoryName.toLowerCase().includes(normalizedFilter);
        
        if (exactMatch || normalizedMatch || containsMatch) {
            console.log('Found matching category, showing:', categoryNameToFilter, 'matched with:', categoryName);
            categorySection.style.display = 'block';
            foundMatch = true;
        } else {
            categorySection.style.display = 'none';
        }
    });
    
    if (!foundMatch) {
        console.warn('No matching category found for:', categoryNameToFilter);
        console.log('Available categories:', Array.from(allCategories).map(s => s.dataset.categoryName));
    }
}

function filterCafeteriaByCategory(categoryNameToFilter) {
    console.log('Filtering cafeteria by category:', categoryNameToFilter);
    const allCategories = document.querySelectorAll('#cafeteriaGrid .category-section');
    const cafeteriaTitle = document.getElementById('cafeteria-main-title');

    console.log('Found cafeteria categories:', allCategories.length);
    allCategories.forEach((section, index) => {
        console.log(`Cafeteria Category ${index}:`, section.dataset.categoryName);
    });

    if (cafeteriaTitle) cafeteriaTitle.style.display = 'none';
    
    const normalizedFilter = categoryNameToFilter.toLowerCase().trim();
    let foundMatch = false;
    
    allCategories.forEach(categorySection => {
        const categoryName = categorySection.dataset.categoryName;
        const normalizedName = categorySection.dataset.normalizedName || categoryName.toLowerCase().trim();
        
        // Try multiple matching strategies
        const exactMatch = categoryName === categoryNameToFilter;
        const normalizedMatch = normalizedName === normalizedFilter;
        const containsMatch = categoryName.toLowerCase().includes(normalizedFilter);
        
        if (exactMatch || normalizedMatch || containsMatch) {
            console.log('Found matching cafeteria category, showing:', categoryNameToFilter, 'matched with:', categoryName);
            categorySection.style.display = 'block';
            foundMatch = true;
        } else {
            categorySection.style.display = 'none';
        }
    });
    
    if (!foundMatch) {
        console.warn('No matching cafeteria category found for:', categoryNameToFilter);
        console.log('Available cafeteria categories:', Array.from(allCategories).map(s => s.dataset.categoryName));
    }
}

function applyFilterFromURL() {
    const hash = window.location.hash;
    if (!hash) return;

    console.log('Applying filter from URL:', hash);

    if (hash.startsWith('#category-') || hash.startsWith('#cafeteria-category-')) {
        // Extract category name from hash directly
        let categoryName = '';
        let isCafeteriaCategory = hash.startsWith('#cafeteria-category-');
        
        // Try to get from link first
        const link = document.querySelector(`a[href="${hash}"]`);
        console.log('Looking for link with href:', hash);
        console.log('Found link:', link);
        
        if (link) {
            categoryName = link.textContent.trim();
            console.log('Category name from link:', categoryName);
        } else {
            // Fallback: extract from hash and try to find matching section
            const hashPart = hash.substring(isCafeteriaCategory ? '#cafeteria-category-'.length : '#category-'.length);
            const titleElement = document.getElementById(hash.substring(1));
            if (titleElement) {
                categoryName = titleElement.textContent.trim();
                console.log('Category name from title element:', categoryName);
            } else {
                // Last resort: convert hash back to readable name
                categoryName = hashPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                console.log('Category name from hash conversion:', categoryName);
            }
        }
        
        if (categoryName) {
            // A small delay to ensure that the product sections are rendered
            setTimeout(() => {
                if (isCafeteriaCategory) {
                    filterCafeteriaByCategory(categoryName);
                } else {
                    filterProductsByCategory(categoryName);
                }
                if (typeof smoothScrollToAnchor === 'function') {
                    smoothScrollToAnchor(hash);
                }
            }, 300); // Increased delay to be safe
        } else {
            console.warn('Could not determine category name for hash:', hash);
        }
    }
}

