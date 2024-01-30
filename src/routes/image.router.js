const { getAll, create, remove,  } = require('../controllers/image.controllers');
const express = require('express');
const upload = require('../utils/multer');

const imageRouter = express.Router();

imageRouter.route('/images')
    .get(getAll)
    .post(upload.single('image'), create)

imageRouter.route('/images/:id')
    .delete(remove)

module.exports = imageRouter;