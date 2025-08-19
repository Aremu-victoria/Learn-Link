const mongoose = require('mongoose');
const userSchema = require('../schemas/usersSchemas'); 

const accounts = mongoose.model('accounts', userSchema);

module.exports = accounts;