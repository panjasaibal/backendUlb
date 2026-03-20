const { v2 } = require("cloudinary");
const fs = require("fs");
const ApiError = require("./ApiError");

v2.config({
  cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

exports.uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new ApiError(500, "localFilePath Not present");
    const uploadResponse = await v2.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        resource_type: "image",
      }
    );
    return uploadResponse;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log(err.message);
    return null;
  }
};

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = v2.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);


