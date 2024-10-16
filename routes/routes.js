const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();
const MULTER = require('multer');
const UPLOAD = MULTER({ dest: './public/uploads/' });
const CONTROLLERS = require('./controllers');


ROUTER.get('/', CONTROLLERS.GET_HOME);
ROUTER.get('/products', CONTROLLERS.GET_PRODUCTS);
ROUTER.get('/products/:_id', CONTROLLERS.GET_PRODUCT);
ROUTER.get('/dashboard', CONTROLLERS.GET_DASHBOARD);
ROUTER.get('/dashboard/new', CONTROLLERS.GET_DASHBOARD_NEW);
ROUTER.post('/dashboard/new', UPLOAD.single('imagen'), CONTROLLERS.POST_DASHBOARD_NEW);
ROUTER.get('/dashboard/edit/:_id', CONTROLLERS.GET_DASHBOARD_EDIT);
ROUTER.post('/dashboard/edit/:_id', UPLOAD.single('imagen'), CONTROLLERS.POST_DASHBOARD_EDIT);
ROUTER.post('/dashboard/delete/:_id', CONTROLLERS.POST_DASHBOARD_DELETE);
ROUTER.get('/dashboard/delete/success', CONTROLLERS.GET_DASHBOARD_DELETE_SUCCESS);
ROUTER.get('/dashboard/edited/success', CONTROLLERS.GET_DASHBOARD_EDITED_SUCCESS);
ROUTER.get('/dashboard/new/success', CONTROLLERS.GET_DASHBOARD_CREATE_SUCCESS);
ROUTER.post('/login', CONTROLLERS.POST_LOGIN);
ROUTER.get('/logout', CONTROLLERS.GET_LOGOUT);

module.exports = ROUTER;
