const express = require('express');
const userRouter = require('./user.router');
const categoryRouter = require('./category.router');
const productRouter = require('./product.router');
const imageRouter = require('./image.router');
const productsCartRouter = require('./productsCart.router');
const purchaseRouter = require('./purchase.router');
const router = express.Router();

// colocar las rutas aquí
router.use(userRouter);
router.use(categoryRouter);
router.use(productRouter);
router.use(imageRouter);
router.use(productsCartRouter);
router.use(purchaseRouter);
module.exports = router;