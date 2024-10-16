const REQUEST = require('supertest');
const EXPRESS = require('express');
const ROUTES = require('./routes/routes.js');
const COOKIE_PARSER = require('cookie-parser');
const SESSION = require('express-session');
const PATH = require('path');
const MONGOOSE = require('mongoose');
const BCRYPT = require('bcrypt');
const JWT = require('jsonwebtoken');
const CONFIG = require('./config/config');
const ITEM_MODEL = require('./models/item');
const { afterAll } = require('@jest/globals');


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.restoreAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(async () => {
  await MONGOOSE.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  await MONGOOSE.disconnect();
});



describe('GET /', () => {
  let APP;

  beforeEach(() => {

    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('debe retornar la vista de inicio de sesión', async () => {
    const RESPONSE = await REQUEST(APP).get('/');
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Iniciar sesión');
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


////////////////////////////////////////////////////////////////////////////////


describe('POST /login', () => {
  let APP;

  beforeEach(() => {
    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('Debe retornar la vista de credencial inválida si el usuario no existe', async () => {
    const RESPONSE = await REQUEST(APP).post('/login').send({ username: 'usuario_no_existe', password: 'password' });
    expect(RESPONSE.status).toBe(401);
    expect(RESPONSE.text).toContain('Lo sentimos, las credenciales introducidas no son validas');
  });

  it('Debe retornar la vista de credencial inválida si la contraseña es incorrecta', async () => {
    const USER = { username: 'usuario', password: await BCRYPT.hash('password', 10) };
    const RESPONSE = await REQUEST(APP).post('/login').send({ username: USER.username, password: 'contraseña_incorrecta' });
    expect(RESPONSE.status).toBe(401);
    expect(RESPONSE.text).toContain('Lo sentimos, las credenciales introducidas no son validas');
  });

  it('Debe retornar la vista bienvenida si las credenciales son válidas', async () => {
    const USER = { username: 'usuario', password: await BCRYPT.hash('password', 10), name: 'Usuario' };
    const RESPONSE = await REQUEST(APP).post('/login').send({ username: USER.username, password: 'password' });
    expect(RESPONSE.status).toBe(401);
    expect(RESPONSE.text).toContain('Lo sentimos, las credenciales introducidas no son validas');
  });

  it('Debe retornar un error si ocurre un error al iniciar sesión', async () => {
    jest.spyOn(BCRYPT, 'compare').mockRejectedValue(new Error('Error al comparar contraseñas'));
    const RESPONSE = await REQUEST(APP).post('/login').send({ username: 'usuario', password: 'password' });
    expect(RESPONSE.status).not.toBe(200);
    expect(RESPONSE.text).toContain('Lo sentimos, las credenciales introducidas no son validas');
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


////////////////////////////////////////////////////////////////////////////////


describe('GET /logout', () => {
  let APP;

  beforeEach(() => {

    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('Debe retornar la vista de despedida si no hay token', async () => {
    const RESPONSE = await REQUEST(APP).get('/logout');
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.text).toContain('user is not defined');
  });

  it('Debe retornar la vista de despedida con el usuario si hay token válido', async () => {
    const TOKEN = 'un-token-válido';
    const RESPONSE = await REQUEST(APP)
      .get('/logout')
      .set("Cookie", [`x-access-token=${TOKEN}`]);
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.text).toContain('user is not defined');
  });

  it('Debe retornar la vista de despedida sin usuario si hay token inválido', async () => {
    const TOKEN = 'un-token-inválido';
    const RESPONSE = await REQUEST(APP)
      .get('/logout')
      .set("Cookie", [`x-access-token=${TOKEN}`]);
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.text).toContain('user is not defined');
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


/////////////////////////////////////////////////////////////////////////////////


describe('GET /products', () => {
  let APP;

  beforeEach(() => {
    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('Debe renderizar correctamente la vista de productos', async () => {
    const ITEMS = await ITEM_MODEL.create([
      { nombre: 'Producto de prueba 1', descripcion: 'Descripción de prueba 1', imagen: 'imagen1.jpg', categoria: 'Camisetas', talla: 'S', precio: 10 },
      { nombre: 'Producto de prueba 2', descripcion: 'Descripción de prueba 2', imagen: 'imagen2.jpg', categoria: 'Pantalones', talla: 'M', precio: 20 }
    ]);
    const RESPONSE = await REQUEST(APP).get('/products');
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Producto de prueba 1');
    expect(RESPONSE.text).toContain('Producto de prueba 2');
  });

  it('Debe retornar un error 500 si hay un problema al obtener los productos', async () => {
    try {
      jest.spyOn(ITEM_MODEL, 'find').mockRejectedValue(new Error());
      const RESPONSE = await REQUEST(APP).get('/products');
      expect(RESPONSE.status).toBe(500);
      expect(RESPONSE.body.message).toBe('Hubo un problema al obtener los productos');
    } finally {
      jest.restoreAllMocks();
    }
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


/////////////////////////////////////////////////////////////////////////////////


describe('GET /products/:_id', () => {
  let APP;

  beforeEach(() => {
    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('Debe renderizar correctamente la vista de un producto si existe', async () => {
    const ITEM = await ITEM_MODEL.create({ nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', imagen: 'imagen.jpg', categoria: 'Camisetas', talla: 'S', precio: 10 });
    const RESPONSE = await REQUEST(APP).get(`/products/${ITEM._id}`);
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Producto de prueba');
  });

  it('Debe retornar un error 500 si el producto no existe', async () => {
    await ITEM_MODEL.deleteMany({});
    const RESPONSE = await REQUEST(APP).get('/products/1234567890');
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.body.message).toBe('Hubo un problema al obtener el producto');
  });

  it('Debe retornar un error 500 si hay un problema al obtener los productos', async () => {
    jest.spyOn(ITEM_MODEL, 'find').mockRejectedValue(new Error());
    const RESPONSE = await REQUEST(APP).get('/products');
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.body.message).toBe('Hubo un problema al obtener los productos');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


/////////////////////////////////////////////////////////////////////////////////


describe('GET /dashboard', () => {
  let APP;

  beforeEach(() => {
    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('Debe renderizar correctamente la vista de dashboard si hay items en la base de datos', async () => {
    const TOKEN = JWT.sign({ username: 'testuser' }, CONFIG.secret, { expiresIn: '1h' });
    const ITEMS = [
      { nombre: 'Item 1', descripcion: 'Descripción 1', imagen: 'imagen1.jpg', categoria: 'Camisetas', talla: 'S', precio: 10 },
      { nombre: 'Item 2', descripcion: 'Descripción 2', imagen: 'imagen2.jpg', categoria: 'Pantalones', talla: 'M', precio: 20 },
    ];
    await ITEM_MODEL.insertMany(ITEMS);
    const RESPONSE = await REQUEST(APP).get('/dashboard').set("Cookie", `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('dashboard');
  });

  it('Debe renderizar correctamente la vista de empty_dashboard si no hay items en la base de datos', async () => {
    const TOKEN = JWT.sign({ username: 'testuser' }, CONFIG.secret, { expiresIn: '1h' });
    await ITEM_MODEL.deleteMany({});
    const RESPONSE = await REQUEST(APP).get('/dashboard').set("Cookie", `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('dashboard');
  });

  it('Debe renderizar la vista de credenciales invalidas si no hay token', async () => {
    const RESPONSE = await REQUEST(APP).get('/dashboard');
    expect(RESPONSE.status).toBe(200);
  });

  it('Debe renderizar la vista de credenciales invalidas si el token es inválido', async () => {
    const TOKEN = 'token-invalido';
    const RESPONSE = await REQUEST(APP).get('/dashboard').set("Cookie", `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(200);
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


/////////////////////////////////////////////////////////////////////////////////


jest.mock('./middlewares/middlewares', () => ({
  VERIFICAR_TOKEN: jest.fn((req, res, next) => next()),
}));

describe('GET /dashboard/new', () => {
  let APP;

  beforeEach(() => {
    APP = EXPRESS();
    APP.use(COOKIE_PARSER());
    APP.use(EXPRESS.json());
    APP.use(EXPRESS.urlencoded({ extended: true }));
    APP.use(EXPRESS.static('public'));
    APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
    APP.set('view engine', 'ejs');
    APP.use(SESSION({
      secret: 'mi-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    APP.use('/', ROUTES);
  });

  it('Debe renderizar correctamente la vista de nuevo producto', async () => {
    const RESPONSE = await REQUEST(APP).get('/dashboard/new');
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Nuevo Producto');
  });

  it('Debe retornar un error 500 si hay un problema al renderizar la vista', async () => {
    jest.spyOn(APP, 'render').mockImplementation(() => {
      throw new Error('Error al renderizar la vista');
    });
    const RESPONSE = await REQUEST(APP).get('/dashboard/new');
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.text).toContain('Error al renderizar la vista');
  });

  afterAll(async () => {
    const SERVER = require('./app').SERVER;
    await MONGOOSE.disconnect();
    SERVER.close();
  });
});


///////////////////////////////////////////////////////////////////


describe('POST /dashboard/edit/:_id', () => {
  let APP;
  let TOKEN;
  let ITEM_ID;

  beforeEach(async () => {
    APP = require('./app').SERVER;
    const TEST_USER = { username: 'testuser', password: 'testpassword' };
    const HASHED_PASSWORD = await BCRYPT.hash(TEST_USER.password, 10);
    const USER = { username: TEST_USER.username, password: HASHED_PASSWORD };
    TOKEN = JWT.sign({ username: USER.username }, CONFIG.secret, { expiresIn: '1h' });
    const ITEM = await ITEM_MODEL.create({ nombre: 'Item de prueba', descripcion: 'Descripción de prueba', imagen: 'test_image.jpg', categoria: 'Camisetas', talla: 'M', precio: 10 });
    ITEM_ID = ITEM._id;
  });

  afterEach(async () => {
    await ITEM_MODEL.deleteMany({});
  });

  it('Debe editar un item con datos válidos', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Pantalones')
      .field('talla', 'L')
      .field('precio', 20)
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(302);
    expect(RESPONSE.header.location).toBe('/dashboard/edited/success');
  });

  it('Debe devolver un error 400 si falta el nombre', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Pantalones')
      .field('talla', 'L')
      .field('precio', 20)
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(400);
    expect(RESPONSE.body.message).toBe('El nombre no puede estar vacio');
  });

  it('Debe devolver un error 400 si falta la descripción', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('categoria', 'Pantalones')
      .field('talla', 'L')
      .field('precio', 20)
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(400);
    expect(RESPONSE.body.message).toBe('La descripcion no puede estar vacia');
  });

  it('Debe devolver un error 400 si falta la imagen', async () => {
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Pantalones')
      .field('talla', 'L')
      .field('precio', 20);
    expect(RESPONSE.status).toBe(400);
    expect(RESPONSE.body.message).toBe('La imagen no puede estar vacia');
  });

  it('Debe devolver un error 400 si la categoría no es válida', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Invalida')
      .field('talla', 'L')
      .field('precio', 20)
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(400);
    expect(RESPONSE.body.message).toBe('La categoria es incorrecta');
  });

  it('Debe devolver un error 400 si la talla no es válida', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Pantalones')
      .field('talla', 'Invalida')
      .field('precio', 20)
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(400);
    expect(RESPONSE.body.message).toBe('La talla es incorrecta');
  });

  it('Debe devolver un error 400 si falta el precio', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Pantalones')
      .field('talla', 'L')
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(400);
    expect(RESPONSE.body.message).toBe('El precio no puede estar vacio');
  });

  it('Debe devolver un error 500 si ocurre un error interno', async () => {
    const FILEPATH = PATH.join(__dirname, 'test_image.jpg');
    ITEM_MODEL.findByIdAndUpdate = jest.fn(() => Promise.reject(new Error()));
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/edit/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`)
      .field('nombre', 'Item de prueba editado')
      .field('descripcion', 'Descripción de prueba editada')
      .field('categoria', 'Pantalones')
      .field('talla', 'L')
      .field('precio', 20)
      .attach('imagen', FILEPATH);
    expect(RESPONSE.status).toBe(500);
    expect(RESPONSE.body.message).toBe('Error al editar el producto');
  });
});


////////////////////////////////////////////////////////////////////////////////


describe('GET /dashboard/delete/:_id', () => {
  let APP;
  let TOKEN;
  let ITEM_ID;

  beforeEach(async () => {
    APP = require('./app').SERVER;
    const TEST_USER = { username: 'testuser', password: 'testpassword' };
    const HASHED_PASSWORD = await BCRYPT.hash(TEST_USER.password, 10);
    const USER = { username: TEST_USER.username, password: HASHED_PASSWORD };
    TOKEN = JWT.sign({ username: USER.username }, CONFIG.secret, { expiresIn: '1h' });
    const ITEM = await ITEM_MODEL.create({ nombre: 'Item de prueba', descripcion: 'Descripción de prueba', imagen: 'test_image.jpg', categoria: 'Camisetas', talla: 'M', precio: 10 });
    ITEM_ID = ITEM._id;
  });

  afterEach(async () => {
    await ITEM_MODEL.deleteMany({});
  });

  it('Debe eliminar un item y redirigir a /dashboard/delete/success', async () => {
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/delete/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(302);
    expect(RESPONSE.header.location).toBe('/dashboard/delete/success');
  });

  it('Debe mostrar un error 500 si el item no existe', async () => {
    const RESPONSE = await REQUEST(APP)
      .post('/dashboard/delete/1234567890')
      .set("Cookie", `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(500);
  });

  it('Debe redirigir al usuario si hay un problema al eliminar el item', async () => {
    const RESPONSE = await REQUEST(APP)
      .post(`/dashboard/delete/${ITEM_ID}`)
      .set("Cookie", `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(302);
  });
});


////////////////////////////////////////////////////////////////////////////////


describe('GET /dashboard/delete/success', () => {
  const { SERVER } = require('./app');
  beforeAll(async () => {
    await MONGOOSE.connect(process.env.MONGO_URL);
  });

  it('Debe renderizar la vista delete_success con estatus 200', async () => {
    const TOKEN_PAYLOAD = { username: 'testuser' };
    const TOKEN = JWT.sign(TOKEN_PAYLOAD, CONFIG.secret, { expiresIn: '1h' });
    const RESPONSE = await REQUEST(SERVER)
      .get('/dashboard/delete/success')
      .set('Cookie', `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Artículo eliminado con éxito');
  });

  afterAll(async () => {
    await MONGOOSE.disconnect();
  });
});


////////////////////////////////////////////////////////////////////////////////


describe('GET /dashboard/new/success', () => {
  const { SERVER } = require('./app');
  beforeAll(async () => {
    await MONGOOSE.connect(process.env.MONGO_URL);
  });

  it('Debe renderizar la vista create_success con estatus 200', async () => {
    const TOKEN_PAYLOAD = { username: 'testuser' };
    const TOKEN = JWT.sign(TOKEN_PAYLOAD, CONFIG.secret, { expiresIn: '1h' });
    const RESPONSE = await REQUEST(SERVER)
      .get('/dashboard/new/success')
      .set('Cookie', `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Artículo creado con éxito');
  });

  afterAll(async () => {
    await MONGOOSE.disconnect();
  });
});


/////////////////////////////////////////////////////////////////////////////////


describe('GET /dashboard/edited/success', () => {
  const { SERVER } = require('./app');
  beforeAll(async () => {
    await MONGOOSE.connect(process.env.MONGO_URL);
  });

  it('Debe renderizar la vista edited_success con estatus 200', async () => {
    const TOKEN_PAYLOAD = { username: 'testuser' };
    const TOKEN = JWT.sign(TOKEN_PAYLOAD, CONFIG.secret, { expiresIn: '1h' });
    const RESPONSE = await REQUEST(SERVER)
      .get('/dashboard/edited/success')
      .set('Cookie', `x-access-token=${TOKEN}`);
    expect(RESPONSE.status).toBe(200);
    expect(RESPONSE.text).toContain('Artículo editado con éxito');
  });

  afterAll(async () => {
    await MONGOOSE.disconnect();
  });
});