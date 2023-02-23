const router = require("express").Router();
const userRouter = require("../Controller/userController");
const { verifyToken,verifyTokenAndUser } = require("../middlewares/auth");

router.post("/userSignUp", userRouter.userSignUp);
router.post("/userLoginEmail", userRouter.userLoginEmail);
router.get("/userList",verifyToken,verifyTokenAndUser, userRouter.userList)
router.get("/userfindbyId/:id",verifyToken,verifyTokenAndUser,userRouter.userfindbyId)
router.put("/userEdit/:id",verifyToken,verifyTokenAndUser,userRouter.userEdit)
router.delete("/userDelete/:id",verifyToken,verifyTokenAndUser,userRouter.userDelete)


module.exports = router;
