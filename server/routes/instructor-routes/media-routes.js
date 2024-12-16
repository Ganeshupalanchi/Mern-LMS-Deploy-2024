const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading asset." });
  }
});

router.delete("/delete/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;
    // console.log(public_id);
    // return;

    if (!public_id) {
      return res.status(400).json({ success: false, message: "Not Found." });
    }
    await deleteMediaFromCloudinary(public_id);
    res
      .status(200)
      .json({ success: true, message: "Asser deleted from cloudinary." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete asset." });
  }
});
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromise = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );
    const results = await Promise.all(uploadPromise);
    // const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error uploading assets." });
  }
});

module.exports = router;
