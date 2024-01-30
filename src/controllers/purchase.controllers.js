const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const ProductsCart = require('../models/ProductsCart');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const {id} = req.user;
    const purchases = await Purchase.findAll({include:[{
        model:Product,
        include:[Image]}],
        where: {userId: id}});
    return res.json(purchases);
});


const create = catchError(async(req,res)=>{
    const productsCart = await ProductsCart.findAll({
        where: {userId: req.user.id},
        attributes: ['quantity', 'userId', 'productId'],
        raw: true,
    })
    
    const purchases = await Purchase.bulkCreate(productsCart);
    await ProductsCart.destroy({where: {userId: req.user.id}})
    return res.json(purchases);
})


// const create = catchError(async(req, res) => {
//     const {id} = req.user;
//     const productsCart = await ProductsCart.findAll({------ // trae el carrito de compras
//         where: {userId: id} ---- //los filtra para recibir el usuario loggeado
//     })

//     productsCart.map(async prod => {-----//itera los productos que estan en el carrito
//         const {id,quantity,userId,productId} = prod.dataValues -----// desestructura los valores del carrito
//         await Purchase.create({ ---// esos valores desetructurados del carrto se los pasa purchases para crear la compra
//             quantity,
//             userId,
//             productId
//         })
//     })
//    await ProductsCart.destroy({where: {userId: id} });// ----- borra todo lo que esta en el carrito de compras
//    return res.json({message:'carrito comprado'})
// });



module.exports = {
    getAll,
    create
}