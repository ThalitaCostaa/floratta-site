// Initialize Supabase client
const supabaseUrl = 'https://ggpdipsjxkbusemsdyfu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncGRpcHNqeGtidXNlbXNkeWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDY1ODksImV4cCI6MjA2MzYyMjU4OX0.Al33UO6GmDQqxddsUo-IBS6KUswpCph535FEgtqBRF0'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)



// CONFIGURAÇÃO DE FRETE - EDITE AQUI OS BAIRROS E VALORES
const freteOptions = {
    'centro': { name: 'Centro', value: 10.00 },
    'jardim-itamarati': { name: 'Jardim Itamarati', value: 10.00 },
    'jardim-garuva': { name: 'Jardim Garuva', value: 10.00 },
    'vila-trevo': { name: 'Vila Trevo', value: 10.00 },
    'geórgia-paula': { name: 'Geórgia Paula', value: 10.00 },
    'urubuquara': { name: 'Urubuquara', value: 20.00 },
    'mina-velha': { name: 'Mina Velha', value: 35.00 },
    'rio-bonito': { name: 'Rio Bonito', value: 35.00 },
    'outros': { name: 'Outros Bairros', value: 35.00 }
};

let cart = [];
let cartTotal = 0;
let freteValue = 0;

// Cart functions
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function saveCartToSession() {
    sessionStorage.setItem('florattaCart', JSON.stringify(cart));
}

function loadCartFromSession() {
    const savedCart = sessionStorage.getItem('florattaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartTotal = cart.reduce((total, item) => total + item.price, 0);
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromSession();
    updateCartCount();
});