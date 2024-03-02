import fs from "fs";
import express from "express";
import { getProductsFilePath, configureMulter } from "../util.js";
import { io } from "../app.js";

const viewRouter = express.Router();
const productoFilePath = getProductsFilePath();
const imgUpload = configureMulter();

viewRouter.get("/", (req, res) => {
    res.render("home");
});

viewRouter.get("/realtimeproducts", (req, res) => {
    try {
        const rawData = fs.readFileSync(productoFilePath);
        const productos = JSON.parse(rawData);
        res.render("realTimeProducts", { productos });
    } catch (error) {
        console.error("Error al leer el archivo productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

viewRouter.post("/realtimeproducts/addProduct", imgUpload.single("image"), (req, res) => {
    try {
        console.log("Solicitud de agregar un nuevo producto");
        const rawData = fs.readFileSync(productoFilePath);
        let productos = JSON.parse(rawData);

        const { title, description, price, stock, category } = req.body;
        
        console.log("Datos del producto recibidos:", title, description, price, stock, category);
        console.log("Archivo de imagen:", req.file);

        const imageName = req.file ? req.file.filename : null;

        if (!imageName) {
            return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
        }

        const newProduct = {
            id: productos.length + 1,
            title,
            description,
            price,
            stock,
            category,
            image: imageName
        };
        productos.push(newProduct);

        fs.writeFileSync(productoFilePath, JSON.stringify(productos, null, 2));
        io.emit('newProduct', newProduct);
        console.log("Producto agregado:", newProduct);
        res.redirect("/realtimeproducts");
    } catch (error) {
        console.error("Error al agregar un producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

viewRouter.delete('/realtimeproducts/deleteProduct/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const rawData = fs.readFileSync(productoFilePath);
        let productos = JSON.parse(rawData);

        const index = productos.findIndex(producto => producto.id === productId);

        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        productos.splice(index, 1);

        fs.writeFileSync(productoFilePath, JSON.stringify(productos, null, 2));
        io.emit('deleteProduct', productId);

        res.status(200).json({ message: 'Producto eliminado exitosamente', productId });
    } catch (error) {
        console.error('Error al eliminar un producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default viewRouter;