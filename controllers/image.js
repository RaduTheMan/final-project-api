const { v4: uuidv4 } = require("uuid");
const uploadToBucket = require("../util/upload-to-bucket");

exports.uploadImage = (req, res, next) => {
    let extension = req.body.image.slice(11, 14);
    if (extension !== 'png') {
        extension = 'jpeg';
    }
    let imgData = req.body.image.replace(/^data:image\/png;base64,/, "");
    imgData = imgData.replace(/^data:image\/jpeg;base64,/, "");
    const data = Buffer.from(imgData, "base64");
    const uniqueId = uuidv4();
    uploadToBucket('bucket_image_files', data, uniqueId, extension).then();
    //de adaugat url in tabela users
};