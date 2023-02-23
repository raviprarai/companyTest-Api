const productModel = require("../model/productModel");
const { productData, reviewSchema } = require("../validators/allValidator");
const user = require("../model/userModel");
const Joi = require("joi");
exports.addProduct = async (req, res) => {
  try {
    const data = req.body;
    const { error } = productData.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    } else {
      const responce = await productModel.create(data);
      if (responce) {
        return res.status(200).json({
          status: 1,
          message: "Add Product Successfully....",
          responce,
        });
      } else {
        return res.status(400).json({
          status: 0,
          message: "Sorry",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.productList = async (req, res) => {
  try {
    const data = await productModel.find();
    if (!data[0]) {
      return res.status(404).json({
        status: 0,
        message: "No Data",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "All product List Found..",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.productfindbyId = async (req, res) => {
  try {
    const data = await productModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Found..",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Get Data found...",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.productEdit = async (req, res) => {
  try {
    const data = req.body;
    const validateKey = [
      "productName",
      "productPrice",
      "productOfferPrice",
      "productStock",
      "productDescription",
    ];
    for (let key of validateKey) {
      if (!data[key] || data[key] == undefined) {
        return res.status(400).json({
          status: 0,
          message: key + "filed required.",
        });
      }
    }
    const updatedUser = await productModel.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: 0,
        message: "Id Not Found....",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Update successfully.....",
        result: updatedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.productDelete = async (req, res) => {
  try {
    const data = await productModel.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 0,
        message: "Data Not Found..",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Product  deleted..",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    });
  }
};
exports.giveReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    } else {
      const product = await productModel.findOneAndUpdate(
        {
          _id: req.params.id,
          productReview: {
            $not: { $elemMatch: { reviewBy: req.user.id } },
          },
        },
        {
          $push: {
            productReview: {
              review: req.body.review,
              reviewBy: req.user.id,
              comment: req.body.comment,
            },
          },
        }
      );
      if (product) {
        return res.status(200).json({
          status: 1,
          message: "Add  Review by User",
        });
      } else {
        return res.status(409).json({
          status: 0,
          message: "You have already given review to this product",
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
exports.getProductRatings = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (product) {
      const result = {
        star1: 0,
        star2: 0,
        star3: 0,
        star4: 0,
        star5: 0,
        overall: 0,
        numberOfReview: 0,
      };
      product.productReview.map((val) => {
        if (val.review === 1) result.star1 = result.star1 + 1;
        else if (val.review === 2) result.star2 = result.star2 + 1;
        else if (val.review === 3) result.star3 = result.star3 + 1;
        else if (val.review === 4) result.star4 = result.star4 + 1;
        else if (val.review === 5) result.star5 = result.star5 + 1;
        result.overall += val.review;
      });
      result.numberOfReview = product.productReview.length;
      result.overall = result.overall / product.productReview.length;
      res.status(200).json({
        status: 1,
        message: "Add Rating by User",
        result,
      });
    } else {
      res.status(404).json({
        status: 0,
        message: "not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 0,
      message: e.toString(),
    });
  }
};
