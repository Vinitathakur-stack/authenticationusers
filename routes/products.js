const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer();
var VerifyToken = require('../VerifyToken');
const upload_controller = require('../uploadFiles');
// include product controller
const product_controller = require('../controllers/product');

//const Cart = require('../model/Cart');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads');
//       },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage: storage });

// routes
router.get('/', product_controller.all_products);
//router.post('/create',product_controller.isLoggedIn,product_controller.uploadImg, product_controller.product_create);
router.post('/create',VerifyToken , upload_controller.upload.array('productPictures'), product_controller.product_create);
router.get('/:id', product_controller.product_details);
router.put('/update/:id', product_controller.product_update);
router.delete('/delete/:id', product_controller.product_delete);

router.post("/cart", product_controller.product_addTocart);

module.exports = router;