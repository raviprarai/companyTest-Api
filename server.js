const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connect } = require("./connection/dbConnection");
dotenv.config();
//!This is a middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
connect();
//!.....................Admin Parts...............................................//
app.use("/userModel", require("./Router/userRouter"));
app.use("/product", require("./Router/productRouter"));
app.use("/cart", require("./Router/cartRouter"));



app.get("/", (req, res) => {
  res.send("<h1>A Node Js API is listening on port:8000</h1>");
});


var PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`A Node Js API is listening on port: ${PORT}`);
});
