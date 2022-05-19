const express = require("express");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user-profile");
const errorController = require("./controllers/error");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(errorController.get404);


const PORT = process.env.PORT || 8082;
app.listen(PORT, (_) => {
  console.log(`App deployed at Port ${PORT}`);
});