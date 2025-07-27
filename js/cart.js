function addToCart(product, price) {
    const quantityInput = event.target.parentElement.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);

    if (quantity > 0) {
        for(let i = 0; i < quantity; i++) {
            cart.push({name: product, price: price});
        }
        cartTotal += price * quantity;
        updateCartCount();
        saveCartToSession();
        showNotification(`${quantity}x ${product} adicionado(s) ao carrinho!`);
        quantityInput.value = 1;
    }
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = '';
    let currentTotal = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)}</p>
            </div>
            <span class="remove-item" data-index="${index}">&times;</span>
        `;
        cartItemsList.appendChild(itemElement);
        currentTotal += item.price;
    });

    updateCartSummary(currentTotal);
    loadFreteOptions();
}

function loadFreteOptions() {
    const deliveryAreaSelect = document.getElementById('deliveryArea');
    deliveryAreaSelect.innerHTML = '<option value="">Selecione o bairro para calcular o frete</option>';
    
    Object.keys(freteOptions).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${freteOptions[key].name} - R$ ${freteOptions[key].value.toFixed(2)}`;
        deliveryAreaSelect.appendChild(option);
    });
}

function updateFrete() {
    const selectedArea = document.getElementById('deliveryArea').value;
    
    if (selectedArea && freteOptions[selectedArea]) {
        freteValue = freteOptions[selectedArea].value;
    } else {
        freteValue = 0;
    }
    
    updateCartSummary(cartTotal);
}

function updateCartSummary(subtotal) {
    document.getElementById('modalCartSubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('modalFreteValue').textContent = `R$ ${freteValue.toFixed(2)}`;
    document.getElementById('modalCartTotal').textContent = `R$ ${(subtotal + freteValue).toFixed(2)}`;
}

function removeCartItem(index) {
    cartTotal -= cart[index].price;
    cart.splice(index, 1);
    updateCartCount();
    saveCartToSession();
    renderCartItems();
    showNotification("Item removido do carrinho!");
}

function showDeliveryModal() {
    if(cart.length === 0) {
        showNotification("Seu carrinho está vazio!");
        return;
    }
    freteValue = 0;
    renderCartItems();
    document.getElementById('deliveryModal').style.display = 'flex';
}

function closeDeliveryModal() {
    document.getElementById('deliveryModal').style.display = 'none';
    freteValue = 0;
    document.getElementById('deliveryArea').value = '';
    updateCartSummary(cartTotal);
}

function getPaymentMethodName(method) {
    const methods = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'credito': 'Cartão de Crédito',
        'debito': 'Cartão de Débito',
        'transferencia': 'Transferência Bancária'
    };
    return methods[method] || method;
}

// Adicionar listener para remover item do carrinho (usando delegação de evento)
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (cartItemsList) {
        cartItemsList.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('remove-item')) {
                const index = parseInt(e.target.dataset.index);
                removeCartItem(index);
            }
        });
    }

    // Form submission handler
    const deliveryForm = document.getElementById('deliveryForm');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const street = document.getElementById('street').value;
            const number = document.getElementById('number').value;
            const neighborhood = document.getElementById('neighborhood').value;
            const complement = document.getElementById('complement').value;
            const deliveryArea = document.getElementById('deliveryArea').value;
            const payment = document.getElementById('payment').value;
            const troco = document.getElementById('troco').value;
            const giftMessage = document.getElementById('giftMessage').value; // Pega a mensagem do presente

            // Verificar se o frete foi selecionado
            if (!deliveryArea) {
                alert('Por favor, selecione a área de entrega para calcular o frete.');
                return;
            }

            let message = `Olá! Gostaria de fazer um pedido na Floratta Flowers\n\n`;
            message += `*Dados do Cliente:*\n`;
            message += `Nome: ${name}\n`;
            message += `Telefone: ${phone}\n\n`;
            
            message += `*Meu Pedido:*\n\n`;
            
            // Lista os produtos de forma mais elegante
            if (cart.length === 1) {
                message += `• ${cart[0].name}\n\n`;
            } else {
                cart.forEach(item => {
                    message += `• ${item.name}\n`;
                });
                message += `\n`;
            }
            
            message += `*Resumo dos Valores:*\n`;
            message += `Produtos: R$ ${cartTotal.toFixed(2)}\n`;
            message += `Frete (${freteOptions[deliveryArea].name}): R$ ${freteValue.toFixed(2)}\n`;
            message += `*Total: R$ ${(cartTotal + freteValue).toFixed(2)}*\n\n`;
            
            message += `*Forma de Pagamento:* ${getPaymentMethodName(payment)}\n`;
            if(payment === 'dinheiro' && troco) {
                message += `*Preciso de troco para:* R$ ${troco}\n`;
            }
            message += `\n`;
            
            message += `*Endereço para Entrega:*\n`;
            message += `${street}, ${number} – ${neighborhood}`;
            if(complement) message += `, ${complement}`;
            message += `\n\n`;
            
            // Adiciona a mensagem de presente se houver uma
            if (giftMessage) {
                message += `*Mensagem para o Presente:*\n`;
                message += `"${giftMessage}"\n\n`;
            }

            message += `Aguardo confirmação do pedido!`;
            message += `\n\nObrigado(a)!`;

            let phoneNumber = "5547996880094";
            let url = "https://wa.me/+" + phoneNumber + "?text=" + encodeURIComponent(message);
            
            // Debug: mostra a URL no console
            console.log("WhatsApp URL:", url);
            
            window.open(url, '_blank');
            
            closeDeliveryModal();
            cart = []; // Limpa o carrinho após o pedido
            cartTotal = 0;
            freteValue = 0;
            updateCartCount();
            saveCartToSession();
        });
    }
}); 