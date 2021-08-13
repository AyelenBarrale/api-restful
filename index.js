const express = require("express");
const { Router } = express;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const routerProductos = new Router();
const routerProducto = new Router();

app.use("/api/productos", routerProductos);
app.use("/api/productos/:id", routerProducto);

app.get("/", (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(__dirname + "/public/index.html");
});

const Contenedor = require("./src/contenedor");
let listaProductos = new Contenedor("./src/productos.json");

/* let productos = [];
let id = 0; */

routerProductos.get("/", async (req, res) => {
  const lista = await listaProductos.getAll();
  try {
    /* res.status(200).json({
      productos: productos,
    }); */
    res.status(200).send(lista);
  } catch (error) {
    res.status(400).send(error);
  }
});

routerProducto.get("/", async (req, res) => {
  const { id } = req.params;
  const producto = await listaProductos.getById(id);
  try {
    if (producto) {
      res.status(200).send(producto);
    } else {
      res.status(404).send("El producto buscado no existe");
    }
  } catch (error) {
    res.status(400).send(error);
  }
  /* const { id } = req.params;
  const producto = productos.find((el) => el.id === id);
  try {
    if (producto) {
      res.status(200).json({
        producto: producto,
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: "Mensaje" });
  } */
});

routerProductos.post("/", async (req, res) => {
  const { body } = req;
  await listaProductos.saveNuevoProd(body);

  try {
    res.status(200).send(body);
  } catch (error) {
    res.status(400).send(error);
  }
  /* const data = req.body;
  id++;
  const producto = { id, ...data };
  productos.push(producto);
  try {
    res.status(200).json({
      agregado: producto,
    });
  } catch (error) {
    res.status(400).json({ error: "Mensaje" });
  } */
});

routerProducto.put("/", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const anterior = await listaProductos.getById(id);
  const nuevo = await listaProductos.updateById(id, body);

  try {
    if (anterior) {
      res.status(200).send({ anterior, nuevo });
    } else {
      res.status(404).send("El producto buscado no existe");
    }
  } catch (error) {
    res.status(400).json({ error: "Mensaje" });
  }
});

routerProducto.delete("/", async (req, res) => {
  const {
    params: { id },
  } = req;

  const productoEliminado = await listaProductos.deleteById(id);
  try {
    res.status(200).send(productoEliminado);
  } catch (error) {
    res.status(400).send(error);
  }
  /* const {
    params: { id },
  } = req;

  const prodEliminado = productos.find((el) => el.id === id);
  const indice = productos.indexOf(prodEliminado);

  productos.splice(indice, 1);

  try {
    res.status(200).json({
      borrado: prodEliminado,
    });
  } catch (error) {
    res.status(400).json({ error: "Mensaje" });
  } */
});

const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server on port: ${PORT}`);
});
