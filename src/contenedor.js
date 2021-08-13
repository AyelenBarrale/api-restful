const fs = require("fs");

class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async getAll() {
    try {
      // eslint-disable-next-line no-unused-vars
      const data = await fs.readFile(
        this.archivo,
        "utf-8",
        // eslint-disable-next-line no-unused-vars
        function (err, data) {
          if (err) console.log("error", err);
        }
      );
      const lista = JSON.parse(data);
      return lista;
    } catch (error) {
      console.log(error);
    }
  }

  async save(nuevaLista) {
    try {
      await fs.promises.writeFile(
        this.archivo,
        nuevaLista,
        // eslint-disable-next-line no-unused-vars
        function (err, result) {
          if (err) console.log("error", err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async saveNuevoProd(product) {
    const lista = await this.getAll();
    const ultId = lista.length ? lista[lista.length - 1].id : 0;
    product.id = ultId + 1;
    lista.push(product);

    const nuevaLista = JSON.stringify(lista);

    await this.save(nuevaLista);
    return product.id;
  }

  async getById(id) {
    try {
      const lista = await this.getAll();
      const prodById = lista.find((prod) => prod.id == id);
      const resultado = prodById ? prodById : null;
      return resultado;
    } catch (error) {
      console.log(error);
    }
  }

  async updateById(id, newProduct) {
    let lista = await this.getAll();

    const index = lista.findIndex((product) => product.id == id);
    let producto = lista[index];

    if (producto) {
      const { title, price, thumbnail } = newProduct;

      producto.title = title;
      producto.price = price;
      producto.thumbnail = thumbnail;

      lista[index] = producto;

      const nuevaListaJson = this.stringify(lista);

      await this.save(nuevaListaJson);
      return producto;
    } else {
      return null;
    }
  }

  async deleteById(id) {
    const lista = await this.getAll();
    const producto = await this.getById(id);

    if (producto) {
      //devuelve array con todos los productos menos el que coincide con el id.
      const nuevaLista = lista.filter((product) => product.id != id);
      const nuevaListaJson = JSON.stringify(nuevaLista);

      await this.save(nuevaListaJson);
      return producto;
    } else {
      return null;
    }
  }
}

module.exports = Contenedor;

/* const products = require("./productos");
let instancia = new Contenedor("./src/productos.json");

const saveAll = async (products) => {
  for (product of products) {
    try {
      await instancia.saveNuevoProd(product);
    } catch (error) {
      console.log(error);
    }
  }
};

saveAll(products)  
    .then( () => instancia.getAll())
    .then( data => console.log(data))
    .then(error => console.log(error)) */
