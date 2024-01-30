const Category = require("./Category");
const Image = require("./Image");
const Product = require("./Product");
const User = require("./User");
const ProductsCart = require("./ProductsCart");
const Purchase = require("./Purchase");


Product.belongsTo(Category);
Category.hasMany(Product);

Product.hasMany(Image);
Image.belongsTo(Product);

ProductsCart.belongsTo(User);
User.hasMany(ProductsCart);

ProductsCart.belongsTo(Product);
Product.hasMany(ProductsCart);

Purchase.belongsTo(User); //una compra va a tener un solo usuario -- este me genera la llavae foranea en purchase
User.hasMany(Purchase);// un usuario va a tener muchas compras

Purchase.belongsTo(Product);// una compra tiene un solo producto
Product.hasMany(Purchase);// un producto tiene muchas compras