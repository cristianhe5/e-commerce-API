const catchError = require('../utils/catchError');
const ProductsCart = require('../models/ProductsCart');
const Product = require('../models/Product');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const results = await ProductsCart.findAll({
        include: [{
            model: Product, 
            include:[Image]}], 
            where: {userId : req.user.id}
        });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id
    const {productId, quantity} = req.body
    const result = await ProductsCart.create({
        productId, 
        quantity, 
        userId
    });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await ProductsCart.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await ProductsCart.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await ProductsCart.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}