const { model, Schema } = require("mongoose");
const user = require("./userModel");
const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productOfferPrice: {
      type: Number,
      required: true,
    },
    productStock: {
      type: Boolean,
      //   required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productReview: [
      {
        review: {
          type: Number,
        },
        reviewBy: {
          type: Schema.Types.ObjectId,
          ref: user,
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = model("product", productSchema);
