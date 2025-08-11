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

// Description Modal Functionality
function openDescriptionModal(productName, productDescription) {
    const descriptionModal = document.getElementById('descriptionModal');
    const descriptionModalTitle = document.getElementById('descriptionModalTitle');
    const descriptionModalText = document.getElementById('descriptionModalText');
    
    if (descriptionModal && descriptionModalTitle && descriptionModalText) {
        descriptionModal.classList.add('active');
        descriptionModalTitle.textContent = productName;
        descriptionModalText.textContent = productDescription;
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Elementos do modal de descrição não encontrados');
    }
}

function closeDescriptionModal() {
    const descriptionModal = document.getElementById('descriptionModal');
    
    if (descriptionModal) {
        descriptionModal.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Initialize description modal when DOM is loaded
function initDescriptionModal() {
    const descriptionModal = document.getElementById('descriptionModal');
    const descriptionSpan = document.querySelector('.close-description-modal');

    // When the user clicks on <span> (x), close the modal
    if (descriptionSpan) {
        descriptionSpan.onclick = function() {
            closeDescriptionModal();
        }
    }

    // When the user clicks anywhere on the modal background, close it
    if (descriptionModal) {
        descriptionModal.onclick = function(event) {
            if (event.target == descriptionModal) {
                closeDescriptionModal();
            }
        }
    }

    // Add event listener for clickable descriptions
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('clickable-description')) {
            const productName = event.target.getAttribute('data-product-name');
            const productDescription = event.target.getAttribute('data-product-description');
            openDescriptionModal(productName, productDescription);
        }
    });
}

// ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const descriptionModal = document.getElementById('descriptionModal');
        const imageModal = document.getElementById('imageModal');
        
        if (descriptionModal && descriptionModal.classList.contains('active')) {
            closeDescriptionModal();
        }
        if (imageModal && imageModal.style.display === 'block') {
            closeImageModal();
        }
    }
});

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initDescriptionModal();
}); 