const path = require('path');
const {check, body} = require('express-validator')

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-Auth')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',[check('title','Title should not be empty').notEmpty().trim(),
    body('imageUrl','image url must be provided').notEmpty().trim(),
    body('price','price should be provided').isFloat().notEmpty(),
    body('description','description should be provided').notEmpty().trim()
],isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',[check('title','Title should not be empty').notEmpty().trim(),
    body('imageUrl','image url must be provided').notEmpty().trim(),
    body('price','price should be provided').isFloat().notEmpty(),
    body('description','description should be provided').notEmpty().trim()
],isAuth, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
