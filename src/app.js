import express from "express";
import http from "http";
import handlebars from "express-handlebars";
import { Server } from "socket.io"
import bodyParser from "body-parser";
import __dirname from "./util.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import viewRouter from "./routes/views.router.js";

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewRouter);

const PORT = 8080;

httpServer.listen(PORT, () => {
    console.log("Servidor conectado!!");
});

export const io = new Server(httpServer);

let messages = [];

io.on('connection', socket => {
    console.log("Nuevo cliente conectado!!");

    socket.on('message', data => {
        messages.push(data);
        io.emit("messageLogs", messages)
    })
})