const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require("path")


const generateUniqueFilename = (file) => {
    const originalname = file.originalname;
    const extension = originalname.split('.').pop(); // Get the file extension
    const uniqueFilename = `${uuidv4()}.${extension}`;
    return uniqueFilename;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/files');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, generateUniqueFilename(file));
    }
})

const upload = multer({ storage: storage });

module.exports = upload;

