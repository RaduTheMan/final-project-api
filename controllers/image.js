const { v4: uuidv4 } = require("uuid");
const uploadToBucket = require("../util/upload-to-bucket");
const uploadProfile = require("../models/user");
const { response } = require("express");

exports.uploadImage = (req, res, next) => {
  let extension = req.body.image.slice(11, 14);
  const userId = req.params.userId;
  if (extension !== "png") {
    extension = "jpeg";
  }
  let imgData = req.body.image.replace(/^data:image\/png;base64,/, "");
  imgData = imgData.replace(/^data:image\/jpeg;base64,/, "");
  const data = Buffer.from(imgData, "base64");
  const uniqueId = uuidv4();
  uploadToBucket("bucket_image_files", data, uniqueId, extension).then((_) => {
    const imgURL = `https://storage.googleapis.com/bucket_image_files/${uniqueId}.${extension}`;
    uploadProfile.uploadImageProfile(imgURL, userId).then(response =>{
        if (!response) {
            res.status(500).json({ errorMessage: "User profile picture not updated" });
          } else {
            res.status(201).json({ successMessage: "User profile picture updated" });
          }
        }
    );
  }).catch( _ =>
    res.status(500).json({ errorMessage: "User profile picture could not be uploaded "})
  );

  //de adaugat url in tabela users
};
