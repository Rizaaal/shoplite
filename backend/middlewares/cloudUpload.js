const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');

    if (!isImage) {
      throw new Error('File not supported');
    }

    return {
      folder: 'shoplite/prodotti',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
      resource_type: 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const cloudUpload = multer({ storage: cloudStorage });

module.exports = cloudUpload;
