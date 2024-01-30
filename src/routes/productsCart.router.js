const { getAll, create, getOne, remove, update } = require('../controllers/productsCart.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const productsCartRouter = express.Router();

productsCartRouter.route('/cart')
    .get(verifyJWT, getAll)
    .post(verifyJWT, create);

productsCartRouter.route('/cart/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = productsCartRouter;