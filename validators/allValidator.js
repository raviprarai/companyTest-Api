const Joi = require("joi");

const userDetails = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name:Joi.string().required(),
  phone:Joi.string().required(),
  address:Joi.string().required(),
  dob:Joi.string().required(),
  gender:Joi.string().required()
});
const userlogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
const productData = Joi.object({
  productName: Joi.string().required(),
  productPrice: Joi.number().required(),
  productOfferPrice:Joi.number().required(),
  productStock:Joi.boolean(),
  productDescription:Joi.string().required(),
  // productReview:Joi.object().required()
});
const reviewSchema=Joi.object({
  review: Joi.number().max(5).min(1).required(),
  comment: Joi.string(),
  reviewBy: Joi.string(),
});
const cartSchema=Joi.object({
  productId: Joi.string().hex().length(24).required(),
});
module.exports = {
    userDetails ,
    userlogin,productData,reviewSchema,cartSchema
};
