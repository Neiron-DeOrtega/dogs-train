import multer = require('multer')
import path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../media"))
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueName + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true)
    } else {
        cb(new Error('Неподдерживаемый тип файла'), false)
    }
}

export const upload = multer({
    fileFilter: fileFilter,
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 },
})