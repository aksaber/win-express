const express = require('express');
const router = express.Router();
let path = require('path');
let formidable = require('formidable');
fs = require('fs');

router.post('/', (req, res) => {
    let form = new formidable.IncomingForm();
    // form.encoding = 'utf-8';
    // 保留扩展名
    form.keepExtensions = true;
    // 文件存储路径，最后要加 '/' 否则会被存在public下
    // form.uploadDir = path.join(__dirname, '../public/images/');
    form.uploadDir = '/var/www/fsnode/web/source/';
    // 解析 formData 数据
    form.parse(req, (err, fields, files) => {
        if (err) return next(err);
        console.log(files.file, 'files');
        let imgPath = files.file.path;
        let imgName = files.file.name;
        console.log(imgName, imgPath);
        // 返回路径和文件名
        res.json({
            code: 1,
            data: {
                name: files.file.name,
                path: files.file.path
            }
        });
    })
})

module.exports = router;