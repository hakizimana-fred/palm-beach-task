import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage, limits: { fileSize: 10000000 } }).single(
  'picture'
);

const uploadImage = (req, res, next) => {
  // eslint-disable-next-line consistent-return
  upload(req, res, error => {
    if (error) {
      return res.status(400).json({
        status: 400,
        error
      });
    }
  });
  next();
};

export default uploadImage;
