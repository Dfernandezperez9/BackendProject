const BCRYPT = require('bcrypt');
const CONFIG = require('../config/config');

const USERS = [
  { 
    id: 1, 
    username: 'admin1', 
    password: BCRYPT.hashSync('password1', CONFIG.bcrypt.saltRounds), 
    name: 'Administrador Uno' 
  },
  { 
    id: 2, 
    username: 'admin2', 
    password: BCRYPT.hashSync('password2', CONFIG.bcrypt.saltRounds), 
    name: 'Administrador Dos' 
  },
];

module.exports = USERS;