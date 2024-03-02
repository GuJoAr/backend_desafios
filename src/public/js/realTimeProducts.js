import { io } from "../../app";

const socket = io();

document.getElementById('addProductForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').files[0];

    console.log('Datos del producto:', title, description, price, stock, category, image);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('image', image);

    socket.emit('addProduct', formData);

    event.target.reset();
});

document.getElementById('productList').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.getAttribute('data-product-id');
        const deleteUrl = event.target.getAttribute('data-delete-url');
        deleteProduct(productId, deleteUrl);
    }
});

function deleteProduct(productId, deleteUrl) {
    console.log('Intentando eliminar el producto con ID:', productId);
    fetch(deleteUrl, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar el producto');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto eliminado exitosamente:', data.productId);
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
}

socket.on('deleteProduct', (productId) => {
    const productElement = document.querySelector(`li[data-product-id="${productId}"]`);
    if (productElement) {
        productElement.remove();
    } else {
        console.error(`Producto con ID ${productId} no encontrado en la interfaz de usuario.`);
    }
});