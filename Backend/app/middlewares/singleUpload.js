import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
    },
});

const singleUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only jpeg files are allowed'));
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

export default singleUpload