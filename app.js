import express from 'express';

const fs = require('fs').promises;
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('productos.json'); 

app.get('/products', async (req, res) => {
    try {
        await productManager.loadProductsFromFile();

        let products = productManager.getProducts();

        const limit = parseInt(req.query.limit);

        if (!isNaN(limit) && limit > 0) {
            products = products.slice(0, limit);
        }

        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo obtener los productos.' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        await productManager.loadProductsFromFile();

        const product = await productManager.getProductById(productId);

        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: 'Productos no encontrados.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor inicio en el puerto ${port}`);
});
