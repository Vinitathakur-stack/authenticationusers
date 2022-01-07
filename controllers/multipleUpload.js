const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadImg = multer({storage: storage}).array('image',2);
exports.multipleUpload = async (req, res) => {
    try {
      await uploadImg1(req, res);
      console.log(req.files);
  
      if (req.files.length <= 0) {
        return res.send(`You must select at least 1 file.`);
      }
  
      return res.send(`Files has been uploaded.`);
    } catch (error) {
      console.log(error);
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
      return res.send(`Error when trying upload many files: ${error}`);
    }
  };