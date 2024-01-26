class ProductManager {
    constructor() {
        this.products = [];
        }

        getProducts() {
        return this.products;
        }

        addProduct({title, description, price, thumbnail, code,stock}) {
            try {
                if (this.products.some(p => p.code === product.code)) {
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
                }
                this.products.push(product)
                return product
            }catch (error) {
                console.log(error.message)
            }
        }
    
        getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Not found");
        }
        return product;
        }
    
        generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
}

const productManager = new ProductManager();

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
