const express = require("express");

const productRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const upload = require("../../middlewares/file.middleware");

const productController = require('../../controllers/product/product.controller');

productRouter.post('/create-product',
    authMiddleware.verifyAccessToken,
    upload.fields([
        { name: "productImages", maxCount: 5 },
        { name: "thumbnailImage", maxCount: 1 }
    ]),
    productController.createProduct
);

productRouter.post('/get-products',
    authMiddleware.verifyAccessToken,
    productController.getProducts
);

module.exports = productRouter;