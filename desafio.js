const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProductsFromFile();
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async saveProductsToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, data, 'utf-8');
        } catch (error) {
            console.log('Error al guardar productos en el archivo:', error.message);
        }
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        try {
            if (this.products.some(p => p.code === code)) {
                throw new Error("El código del producto ya está en uso.");
            }
            const id = this.generateUniqueId();
            const product = {
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            this.products.push(product);
            await this.saveProductsToFile();
            return product;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getProducts() {
        await this.loadProductsFromFile();
        return this.products;
    }

    async getProductById(id) {
        await this.loadProductsFromFile();
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Not found");
        }
        return product;
    }

    async updateProduct(id, updatedProduct) {
        await this.loadProductsFromFile();
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error("Not found");
        }
        this.products[index] = { ...this.products[index], ...updatedProduct };
        await this.saveProductsToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        await this.loadProductsFromFile();
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error("Not found");
        }
        const deletedProduct = this.products.splice(index, 1)[0];
        await this.saveProductsToFile();
        return deletedProduct;
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

const filePath = 'productos.json'; 
const productManager = new ProductManager(filePath);

console.log(productManager.getProducts());

const newProduct = {
    title: "titulo de prueba",
    description: "descripcion de prueba",
    price: 500,
    thumbnail: "No hay imagen",
    code: "123abc",
    stock: 55,
};

try {
    const addedProduct = productManager.addProduct(newProduct);
    console.log("Producto agregado:", addedProduct);
} catch (error) {
    console.log("Error al agregar el producto:", error.message);
}
console.log(productManager.getProducts());

try {
    productManager.addProduct(newProduct);
} catch (error) {
    console.log("Error al agregar el producto:", error.message);
}

const productId = productManager.getProducts()[0].id;
try {
    const foundProduct = productManager.getProductById(productId);
    console.log("Producto encontrado por ID:", foundProduct);
} catch (error) {
    console.log("Not Found:", error.message);
}

try {
    productManager.getProductById("Not Found")
}catch (error) {
    console.log(error.message)
}
