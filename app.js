const { DB_CONNECTION } = require('./config/DB_config.js');
const COOKIE_PARSER = require('cookie-parser');
const SESSION = require('express-session');
const EXPRESS = require('express');
const APP = EXPRESS();
const PORT = 4000;
const ROUTES = require('./routes/routes.js');
const PATH = require('path');
const CORS = require('cors');

APP.use(CORS());
APP.use(COOKIE_PARSER());
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: true }));
APP.use(EXPRESS.static('public'));
APP.use('/css', EXPRESS.static(PATH.join(__dirname, 'css')));
APP.use('/uploads', EXPRESS.static(PATH.join(__dirname, 'uploads')));
APP.set('view engine', 'ejs');

APP.use(SESSION({
  secret: 'mi-secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

APP.use('/', ROUTES);

DB_CONNECTION();

const SERVER = APP.listen(PORT, () => {});

module.exports = { SERVER };