const { model, Schema } = require("mongoose");
const product = require("./productModel");
const user = require("./userModel");
const cartSchema = new Schema({
  cartBy: {
    type: Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: product,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});
module.exports = model("cart", cartSchema);
