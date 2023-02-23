const router = require("express").Router();
const cartRouter = require("../Controller/cartController");
const { verifyToken,verifyTokenAndUser } = require("../middlewares/auth");

router.put("/addToCart",verifyToken,verifyTokenAndUser, cartRouter.addToCart);
router.get("/getCart",verifyToken,verifyTokenAndUser, cartRouter.getCart)
router.get("/generateBill",verifyToken,verifyTokenAndUser, cartRouter.generateBill)
router.put("/removeItemFromCart",verifyToken,verifyTokenAndUser, cartRouter.removeItemFromCart)
router.put("/reduceItemFromCart",verifyToken,verifyTokenAndUser, cartRouter.reduceItemFromCart);
module.exports = router;
