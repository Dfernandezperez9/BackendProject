const USERS = require('../models/users.js');
const JWT = require('jsonwebtoken');
const CONFIG = require('../config/config');
const BCRYPT = require('bcrypt');
const ITEM = require('../models/item');
const { VERIFICAR_TOKEN, GENERAR_TOKEN } = require('../middlewares/middlewares');


exports.GET_HOME = (req, res) => { // ("/")
  res.status(200).render('index', { title: 'Inicio de sesión' });
};


exports.POST_LOGIN = async (req, res) => { // POST ("/login")
  try {
    const { username, password } = req.body;
    const USER = USERS.find((user) => user.username === username);
    if (!USER) {
      return res.status(401).render('credencial_invalida');
    }
    const PASSWORD_VALIDO = await BCRYPT.compare(password, USER.password);
    if (!PASSWORD_VALIDO) {
      return res.status(401).render('credencial_invalida');
    }
    const TOKEN = GENERAR_TOKEN(USER);
    res.cookie('x-access-token', TOKEN, { maxAge: 3600000 });
    res.status(200).render('login', { user: USER.name });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error al iniciar sesión' });
  }
};


exports.GET_LOGOUT = (req, res) => { // GET ("/logout")
  const TOKEN = req.cookies['x-access-token'];
  if (TOKEN) {
    JWT.verify(TOKEN, CONFIG.secret, (err, decoded) => {
      if (err) {
        req.session.user = null;
        res.clearCookie('x-access-token');
        res.status(200).render('logout');
      } else {
        const USER = USERS.find((user) => user.username === decoded.username);
        req.session.user = USER.name;
        res.clearCookie('x-access-token');
        res.status(200).render('logout', { user: req.session.user });
      }
    });
  } else {
    req.session.user = null;
    res.render('logout');
  }
};


exports.GET_PRODUCTS = async (req, res) => { // ("/products")
  try {
    const ITEMS = await ITEM.find();
    res.status(200).render('products', { items: ITEMS });
  } catch (error) {
    res.status(500).send({ message: "Hubo un problema al obtener los productos" });
  }
};


exports.GET_PRODUCT = async (req, res) => { // ("/products/:_id")
  try {
    const ITEM_ID = req.params._id;
    const SELECTED_ITEM = await ITEM.findById(ITEM_ID);
    if (!SELECTED_ITEM) {
      res.status(404).send({ message: 'Producto no encontrado' });
    } else {
      res.status(200).render('product', { item: SELECTED_ITEM });
    }   
  } catch (error) {
    res.status(500).send({ message: "Hubo un problema al obtener el producto" });
  }
};


exports.GET_DASHBOARD = [VERIFICAR_TOKEN, async (req, res) => { // GET ("/dashboard")
  try {
    const ITEMS = await ITEM.find();
    if (!ITEMS || ITEMS.length === 0) {
      res.status(200).render('empty_dashboard');
    } else {
      res.status(200).render('dashboard', { items: ITEMS });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error al obtener los productos' });
  }
}];


exports.GET_DASHBOARD_NEW = [VERIFICAR_TOKEN, (req, res) => { // GET ("/dashboard/new")
  res.status(200).render('new-product');
}];


exports.POST_DASHBOARD_NEW = [VERIFICAR_TOKEN, async (req, res) => { // POST ("/dashboard/new")
  try {
    const { nombre, descripcion, categoria, talla, precio } = req.body;
    const imagen = req.file.filename;
    if (!nombre) {
      return res.status(400).send({ message: 'El nombre no puede estar vacio' });
    }

    if (!descripcion) {
      return res.status(400).send({ message: 'La descripcion no puede estar vacia' });
    }

    if (!imagen) {
      return res.status(400).send({ message: 'La imagen no puede estar vacia' });
    }

    if (!categoria) {
      return res.status(400).send({ message: 'La categoria no puede estar vacia' });
    }

    if (!['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'].includes(categoria)) {
      return res.status(400).send({ message: 'La categoria es incorrecta' });
    }

    if (!talla) {
      return res.status(400).send({ message: 'La talla no puede estar vacia' });
    }

    if (!['XS', 'S', 'M', 'L', 'XL'].includes(talla)) {
      return res.status(400).send({ message: 'La talla es incorrecta' });
    }

    if (!precio) {
      return res.status(400).send({ message: 'El precio no puede estar vacio' });
    }

    const NEW_ITEM = new ITEM({
      nombre,
      descripcion,
      imagen,
      categoria,
      talla,
      precio
    });
    await NEW_ITEM.save();
    res.status(302).redirect('/dashboard/new/success');
    
  } catch (error) {
    res.status(500).send({ message: 'Error al subir el producto' });
  }
}];


exports.GET_DASHBOARD_EDIT = [VERIFICAR_TOKEN, async (req, res) => { // GET ("/dashboard/edit/:_id")
  try {
    const ITEM_ID = req.params._id;
    const EDITED_ITEM = await ITEM.findById(ITEM_ID);
    res.status(200).render('edit-product', { item: EDITED_ITEM });
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener el producto' });
  }
}];


exports.POST_DASHBOARD_EDIT = [VERIFICAR_TOKEN, async (req, res) => { // POST ("/dashboard/edit/:_id")
  try {
    const ITEM_ID = req.params._id;
    const { nombre, descripcion, categoria, talla, precio } = req.body;
    const imagen = req.file ? req.file.filename : null;
    if (!nombre) {
      return res.status(400).send({ message: 'El nombre no puede estar vacio' });
    }

    if (!descripcion) {
      return res.status(400).send({ message: 'La descripcion no puede estar vacia' });
    }

    if (!imagen) {
      return res.status(400).send({ message: 'La imagen no puede estar vacia' });
    }

    if (!categoria) {
      return res.status(400).send({ message: 'La categoria no puede estar vacia' });
    }

    if (!['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'].includes(categoria)) {
      return res.status(400).send({ message: 'La categoria es incorrecta' });
    }

    if (!talla) {
      return res.status(400).send({ message: 'La talla no puede estar vacia' });
    }

    if (!['XS', 'S', 'M', 'L', 'XL'].includes(talla)) {
      return res.status(400).send({ message: 'La talla es incorrecta' });
    }

    if (!precio) {
      return res.status(400).send({ message: 'El precio no puede estar vacio' });
    }

    await ITEM.findByIdAndUpdate(ITEM_ID, {
      nombre,
      descripcion,
      imagen,
      categoria,
      talla,
      precio
    });
    
    res.status(302).redirect('/dashboard/edited/success');
    
  } catch (error) {
    res.status(500).send({ message: 'Error al editar el producto' });
  }
}];


exports.POST_DASHBOARD_DELETE = [VERIFICAR_TOKEN, async (req, res) => { // POST ("/dashboard/delete/:_id")
  try {
    const ITEM_ID = req.params._id;
    const DELETED_ITEM = await ITEM.findByIdAndDelete(ITEM_ID);
    if (!DELETED_ITEM) {
      res.status(404).render('404', { message: 'Producto no encontrado' });
    } else {
      res.status(302).redirect('/dashboard/delete/success');
    }
  } catch (error) {
    res.status(500).render('500', { message: 'Error al eliminar el producto' });
  }
}];


exports.GET_DASHBOARD_DELETE_SUCCESS = [VERIFICAR_TOKEN, (req, res) => { // GET ("/dashboard/delete/success")
  res.status(200).render('delete_success');
}];


exports.GET_DASHBOARD_CREATE_SUCCESS = [VERIFICAR_TOKEN, (req, res) => { // GET ("/dashboard/new/success")
  res.status(200).render('create_success');
}];


exports.GET_DASHBOARD_EDITED_SUCCESS = [VERIFICAR_TOKEN, (req, res) => { // GET ("/dashboard/edited/success")
  res.status(200).render('edited_success');
}];