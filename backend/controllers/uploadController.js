const { sendSuccess, sendError } = require('../utils/response');

const uploadToCloud = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    return sendSuccess(
      res,
      {
        message: 'File uploaded successfully',
        file: {
          url: req.file.path,
          public_id: req.file.filename,
        },
      },
      201,
    );
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't upload file", 500);
  }
};

module.exports = {
  uploadToCloud,
};
