const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;
mongoose.set("strictQuery", false);
exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"));

  mongoose.connection.on("error", (err) => {
    console.log(`DB connection error: ${err.message}`);
  });
};
