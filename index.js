const express = require("express");
const { Router } = express;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const routerProductos = new Router();

app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(__dirname + "/public/index.html");
});

const Contenedor = require("./src/contenedor");
let listaProductos = new Contenedor("./src/productos.json");

routerProductos.get("/", async (req, res) => {
  const lista = await listaProductos.getAll();
  try {
    res.status(200).send(lista);
  } catch (error) {
    res.status(400).send(error);
  }
});

routerProductos.get("/:id", async (req, res) => {
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
});

routerProductos.post("/", async (req, res) => {
  const { body } = req;
  await listaProductos.saveNuevoProd(body);
  try {
    res.status(200).send(body);
  } catch (error) {
    res.status(400).send(error);
  }
});

routerProductos.put("/:id", async (req, res) => {
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

routerProductos.delete("/:id", async (req, res) => {
  const {
    params: { id },
  } = req;

  const productoEliminado = await listaProductos.deleteById(id);
  try {
    res.status(200).send(productoEliminado);
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server on port: ${PORT}`);
});
