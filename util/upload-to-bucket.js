const { Storage } = require("@google-cloud/storage");

const storage = new Storage({});

async function uploadToBucket(bucketName, buffer, uuid, extension) {
    const fileHandle = storage.bucket(bucketName).file(`${uuid}.${extension}`);
    const [fileExists] = await fileHandle.exists();
    return fileHandle.save(buffer);
}

module.exports = uploadToBucket;
