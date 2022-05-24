const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const forms = multer();
const cors = require('cors'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const userRoutes = require("./routes/user-profile");
const postRoutes = require("./routes/post");
const imageRoutes = require("./routes/image.js");
const errorController = require("./controllers/error");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Writify API",
      contact: {
        name: "Anghelus Vlad, Chiriac Catalin, Damian Radu, Dascalu Andrei"
      }
    },
    servers: [
      {
        url: "http://localhost:8082"
      },
      {
        url: "https://final-project-348717.lm.r.appspot.com"
      }
    ]
  },
  apis: ["./controllers/*.js"]
};

const specs = swaggerJsDoc(options);



const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(forms.array()); 
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
//app.use(express.json());
app.use(cors());
//app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.use("/api", userRoutes);
app.use("/api", imageRoutes);
app.use("/api", postRoutes);
app.use(errorController.get404);


const PORT = process.env.PORT || 8082;
app.listen(PORT, (_) => {
  console.log(`App deployed at Port ${PORT}`);
});