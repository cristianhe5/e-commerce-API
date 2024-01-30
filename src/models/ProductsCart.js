const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const ProductsCart = sequelize.define('productCart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

module.exports = ProductsCart;