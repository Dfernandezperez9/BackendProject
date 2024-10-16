const MONGOOSE = require('mongoose');

const ITEM_SCHEMA = new MONGOOSE.Schema({
  nombre: String,
  descripcion: String,
  imagen: String,
  categoria: String,
  talla: String,
  precio: Number
});

const ITEM = MONGOOSE.model('Item', ITEM_SCHEMA);

module.exports = ITEM;