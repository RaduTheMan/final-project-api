const express = require("express");
const app = express();

const PORT = process.env.PORT || 8082;
app.listen(PORT, (_) => {
  console.log(`App deployed at Port ${PORT}`);
});