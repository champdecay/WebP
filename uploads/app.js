const express = require('express'),
    path = require('path'),
    multer = require('multer'),
    sharp = require('sharp'),
    fs = require('fs');

const app = express();

app.set("views", path.join(__dirname, "public"))
app.use(express.static(path.join(__dirname, "public")))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', upload.single('image'), function (req, res, next) {
    const quality = 50;
    const dir = path.join(__dirname, '../uploads/');
    const image = sharp(`${dir + req.file.filename}`);
    image.metadata().then(function (metadata) {
        return image.resize(Math.round(metadata.width / 2))
            .toFormat(req.body.format, { quality })
            .toFile(`${dir}/output.${req.body.format}`, (err, info) => {
                fs.unlink(dir + req.file.filename, (err) => {
                    if (err) throw err;
                    console.info('successfully deleted');
                })
                res.download(`${dir}/output.${req.body.format}`, `${req.file.originalname.split(".")[0]}.${req.body.format}`, function (err) {
                    fs.unlink(`${dir}/output.${req.body.format}`, (err) => {
                        if (err) throw err;
                        console.info('successfully deleted');
                    })
                })
            })
    })
});

app.listen(3000, () => console.log('Server running on port 3000'));