const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDONATY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary.");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete asset from cloudinary.");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
