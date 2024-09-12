const multer = require('multer')

const upload = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    limit: { fileSize: 5000000 }
})

module.exports = upload;