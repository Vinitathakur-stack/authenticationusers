const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

let ProductSchema = new Schema({
    name: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
    //image: String,
    productPictures: [{ img: { type: String } }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
ProductSchema.plugin(mongoosePaginate);

const CartSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      products: [
        {
          productId: Number,
          quantity: Number,
          name: String,
          price: Number
        }
      ],
      active: {
        type: Boolean,
        default: true
      },
      modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
  );
  
 
// Export the model
module.exports = mongoose.model('Product', ProductSchema);
module.exports = mongoose.model("Cart", CartSchema);
  