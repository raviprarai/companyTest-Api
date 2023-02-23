const cartModel = require("../model/cartModel");
const Joi = require("joi");
const { cartSchema } = require("../validators/allValidator");

exports.addToCart = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    } else {
      cartModel
        .findOneAndUpdate(
          { cartBy: req.user.id },
          { cartBy: req.user.id },
          { upsert: true, new: true }
        )
        .exec(function (err, doc) {
          if (err) {
            return res.status(500).send({ message: err.name });
          } else {
            const item = doc.cart.findIndex(
              (item) => item.productId == req.body.productId
            );
            if (item !== -1) {
              doc.cart[item].quantity += 1;
            } else {
              doc.cart.push({ productId: req.body.productId, quantity: 1 });
            }
            doc.save().then((e) => {
              return res.status(200).json({
                status: 1,
                message: "Item added to the cart sucessfully",
              });
            });
          }
        });
    }
  } catch (e) {
    return res.status(500).json({
      status: 0,
      message: e.toString(),
    });
  }
};
exports.getCart = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne(
        { cartBy: req.user.id },
        { __v: 0, _id: 0, cartBy: 0, "cart.id": 0 }
      )
      .populate("cart.productId", {
        totalReview: 0,
        reviewedBy: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });
    if (cart) {
      return res.status(200).json({
        status: 1,
        message: "Get Cart list...",
        cart,
      });
    } else {
      return res.status(404).json({
        status: 0,
        message: "No Data",
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: 0,
      message: e.toString(),
    });
  }
};
exports.removeItemFromCart = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    } else {
      const remove = await cartModel.findOneAndUpdate(
        { cartBy: req.user.id },
        {
          $pull: { cart: { productId: req.body.productId } },
        }
      );
      if (remove) {
        return res.status(200).json({
          status: 1,
          message: "item removed sucessfully",
        });
      } else {
        return res.status(500).json({
          status: 0,
          message: "Something bad happenned",
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      status: 0,
      message: e.toString(),
    });
  }
};
exports.reduceItemFromCart = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    } else {
      cartModel
        .findOne({ cartBy: req.user.id, "cart.productId": req.body.productId })
        .exec(function (err, cart) {
          if (err) {
            return res.status(500).send({ message: "Something bad happenned" });
          }
          if (!cart) {
            return res.status(404).json({
              status: 0,
              message: "Given Id not found in cart",
            });
          }
          const val = cart.cart.findIndex(
            (item) => item.productId == req.body.productId
          );
          if (val === -1) {
            return res.status(404).json({
              status: 0,
              message: "Product not found",
            });
          }
          if (cart.cart[val].quantity == 1) {
            cart.cart.splice(val, 1);
          } else {
            cart.cart[val].quantity--;
          }
          cart.save().then((e) => {
            return res.status(200).json({
              status: 1,
              message: "Item reduced sucessfully",
            });
          });
        });
    }
  } catch (e) {
    return res.status(500).json({
      status: 0,
      message: e.toString(),
    });
  }
};
exports.generateBill = async (req, res) => {
  try {
    cartModel
      .findOne({ cartBy: req.user.id })
      .populate("cart.productId")
      .exec((err, cart) => {
        if (err) {
          res.status(500).send({ message: err.name });
        } else {
          let price = 0;
          cart.cart.map((val) => {
            price += val.quantity * val.productId.productOfferPrice;
          });
          return res.status(200).json({
            status: 1,
            message: "Get Bill..",
            price: price,
          });
        }
      });
  } catch (e) {
    res.status(500).json({
      status: 0,
      message: e.toString(),
    });
  }
};
