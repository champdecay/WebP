const express = require('express'),
    multer = require('multer'),
    webp = require('webp-converter'),
    path = require('path'),
    fs = require('fs');

const app = express()

app.set("views", path.join(__dirname, "public"))
app.use(express.static(path.join(__dirname, "public")))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage });

app.get("/", function (req, res) {
    res.render("index");
})

const dir = path.resolve(__dirname, '../uploads/')
app.post('/', upload.single('image'), function (req, res, next) {
    const result = webp.cwebp(`${dir}/${req.file.filename}`, `${dir}/${req.file.filename}.webp`, "-q 80", logging = "-v");
    result.then((response) => {
        const realFile = `${dir}/${req.file.filename}`
        const file = `${dir}/${req.file.filename}.webp`
        res.download(file, `${req.file.originalname}.webp`, function (err) {
            [realFile, file].forEach(tmpfile => {
                fs.unlink(tmpfile, (err) => {
                    if (err) throw err;
                })
            })
        })
    })
})

app.listen(3000, function () {
    console.log("Server started on port 3000")
})
