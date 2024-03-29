import express from "express";
import fs from "fs";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const rawData = fs.readFileSync("../../productos.json");
        const productos = JSON.parse(rawData);
        
        let result = productos;
        if (limit) {
            result = productos.slice(0, limit);
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const rawData = fs.readFileSync("../../productos.json");
        const productos = JSON.parse(rawData);
        
        const product = productos.find(producto => producto.id === pid);
        
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail
        } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const rawData = fs.readFileSync("../../productos.json");
        const productos = JSON.parse(rawData);
        
        const newProduct = {
            id: productos.length + 1,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail
        };

        productos.push(newProduct);

        fs.writeFileSync("../../productos.json", JSON.stringify(productos, null, 2));

        res.status(201).json({ message: "Producto agregado exitosamente", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updateFields = req.body;
        
        if (!Object.keys(updateFields).length) {
            return res.status(400).json({ error: "No fields to update provided" });
        }

        const rawData = fs.readFileSync("../../productos.json");
        let productos = JSON.parse(rawData);

        const index = productos.findIndex(producto => producto.id === pid);
        
        if (index === -1) {
            return res.status(404).json({ error: "Product not found" });
        }

        const updatedProduct = { ...productos[index] };

        for (const field in updateFields) {
            if (field !== "id") {
                updatedProduct[field] = updateFields[field];
            }
        }

        productos[index] = updatedProduct;
        fs.writeFileSync("../../productos.json", JSON.stringify(productos, null, 2));

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

productRouter.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);

        const rawData = fs.readFileSync("../../productos.json");
        let productos = JSON.parse(rawData);

        const index = productos.findIndex(producto => producto.id === pid);
        
        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        productos.splice(index, 1);

        fs.writeFileSync("../../productos.json", JSON.stringify(productos, null, 2));

        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default productRouter;