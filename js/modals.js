function showNotification(message) {
    if (message === "Seu carrinho está vazio!") {
        showEmptyCartBalloon();
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showEmptyCartBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'empty-cart-balloon';
    balloon.innerHTML = `
        <i class="fas fa-shopping-cart cart-icon"></i>
        <h3>Ops! Carrinho Vazio</h3>
        <p>Você ainda não adicionou nenhum produto ao seu carrinho. Que tal dar uma olhada em nossos produtos frescos?</p>
        <button class="close-btn" onclick="closeEmptyCartBalloon()">Continuar Comprando</button>
    `;
    
    balloon.id = 'emptyCartBalloon';
    document.body.appendChild(balloon);
    
    setTimeout(() => {
        closeEmptyCartBalloon();
    }, 5000);
}

function closeEmptyCartBalloon() {
    const balloon = document.getElementById('emptyCartBalloon');
    if (balloon) {
        balloon.remove();
    }
}

// Image Modal Functionality
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const captionText = document.getElementById('caption');

function openImageModal(element) {
    const img = element.querySelector('img');
    imageModal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
}

function closeImageModal() {
    imageModal.style.display = "none";
}

// Get the <span> element that closes the modal
const span = document.querySelector('.close-image-modal');

// When the user clicks on <span> (x), close the modal
if (span) {
    span.onclick = function() {
        closeImageModal();
    }
}

// When the user clicks anywhere on the modal background, close it
imageModal.onclick = function(event) {
    if (event.target == imageModal) {
        closeImageModal();
    }
} 