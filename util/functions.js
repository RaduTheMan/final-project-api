exports.base64ToBuffer = (data) => {
  let extension = data.slice(11, 14);
  if (extension !== "png") {
    extension = "jpeg";
  }
  let imgData = data.replace(/^data:image\/png;base64,/, "");
  imgData = imgData.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(imgData, "base64");
  return {buffer, extension};
};
