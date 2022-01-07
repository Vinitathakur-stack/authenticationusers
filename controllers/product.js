// include product model
const Product = require('../model/product');

// const multer = require('multer');
// var VerifyToken = require('../VerifyToken');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads');
//       },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
// exports.uploadImg = multer({storage: storage}).array('image',2);

 /* check if user is logged in */ 
//  exports.isLoggedIn = function isLoggedIn(req, res, next) { 
//     console.log("yyyy");
//     const token =  req.headers.authorization.split(" ")[1];
//     console.log(token);
//     return res.status(400).send({
//         success: false,
//         message: "Please enter product name and price"
//     });
   
// } 

// create a new Product.
exports.product_create = function (req, res) {
    console.log(req.body,res.body);
    // validate request
    if(!req.body.name || !req.body.price) {
        return res.status(400).send({
            success: false,
            message: "Please enter product name and price"
        });
    }

   
//check if the product name already exists in db
Product.findOne({ name: req.body.name }, (err, data) => {

    //if product not in db, add it
    if (!data) {
        let productPictures = [];

        if (req.files.length > 0) {
            productPictures = req.files.map((file) => {
            return { img: file.filename };
            });
        }
        //create a new product object using the Product model and req.body
      
        let product = new Product(
            {
                name: req.body.name,
                price: req.body.price,
                productPictures:productPictures,
                //postid:req.body.postid,
                //image: req.file.path,
            }
        );

      
        // save this object to database
            product.save()
            .then(data => {
                //console.log(data._id);
                res.send({
                    success: true,
                    message: 'Product successfully created',
                    data: data
                });
            }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the product."
            });
        });
    //if there's an error or the tea is in db, return a message         
    }else{
        if(err) return res.json(`Something went wrong, please try again. ${err}`);
        return res.json({message:"Product already exists"});
    }
})   
    
};
const getPagination = (page, size) => {
    const limit = size ? +size : 200;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
// retrieve and return all products.
exports.all_products = (req, res) => {
    const { page, size } = req.query;
    //console.log(query);
    const { limit, offset } = getPagination(page, size);
    var options = {
        sort: { _id: 1 },
        offset: offset,
        limit: limit,
        populate: 'postedBy',
      };
   // Product.paginate({name: "wwwww"}, { offset, limit })
  // Product.find().populate("postedBy")
    Product.paginate({}, options)
        .then(data => {
            //PAGINATION
            // let page = parseInt(req.query.page) || 1;
            // let limit = parseInt(req.query.limit) || 5;
            // console.log(page);
            // console.log(limit);
            var message = "";
            if (data === undefined || data.length == 0) message = "No product found!";
            else message = 'Products successfully retrieved';

            res.send({
                success: true,
                message: message,
                data: data
            });
        }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving products."
        });
    });
};

// find a single product with a id.
exports.product_details = (req, res) => {
    Product.findById(req.params.id)
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                message: 'Product successfully retrieved',
                data: data
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving product with id " + req.params.id
        });
    });
};

// update a product  by the id.
exports.product_update = (req, res) => {
    // validate request
    if(!req.body.name || !req.body.price) {
        return res.status(400).send({
            success: false,
            message: "Please enter product name and price"
        });
    }

    // find product and update
    Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {new: true})
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                data: data
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error updating product with id " + req.params.id
        });
    });
};

// delete a product with the specified id.
exports.product_delete = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                message: "Product successfully deleted!"
            });
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete product with id " + req.params.id
        });
    });
};


// Add to cart a product with the specified id.
exports.product_addTocart =  async (req, res) => {
    const { productId, quantity, name, price } = req.body;
  
    const userId = "5de7ffa74fff640a0491bc4f"; //TODO: the logged in user id
  
    try {
      let cart = await Product.findOne({ userId });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          cart.products[itemIndex] = productItem;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ productId, quantity, name, price });
        }
        cart = await cart.save();
        return res.status(201).send(cart);
      } else {
        //no cart for user, create new cart
        const newCart = await Product.create({
          userId,
          products: [{ productId, quantity, name, price }]
        });
  
        return res.status(201).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }