const router = require("express").Router();
const productRouter = require("../Controller/productController");
const { verifyToken,verifyTokenAndUser } = require("../middlewares/auth");

router.post("/addProduct", productRouter.addProduct);
router.get("/productList", productRouter.productList)
router.get("/productfindbyId/:id",productRouter.productfindbyId)
router.put("/productEdit/:id",productRouter.productEdit)
router.delete("/productDelete/:id",productRouter.productDelete)
router.put("/giveReview/:id",verifyToken,verifyTokenAndUser, productRouter.giveReview);
router.get("/getProductRatings/:id",verifyToken,verifyTokenAndUser, productRouter.getProductRatings);

module.exports = router;
