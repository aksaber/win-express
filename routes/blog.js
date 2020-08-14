const express = require('express');
const router = express.Router();
const db = require('../db');
const Unity = require('../unity');

let path = require('path');
let formidable = require('formidable');
fs = require('fs');

// 登录需加载的模块
const common = require('../common');
const jwt = require('jsonwebtoken');  //用来生成token

router.post('/', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const {
                title,
                author,
                date,
                tag,
                type,
                audio,
                intro,
                content,
                coverImage
            } = req.body;
            // 添加博文
            const sql = `INSERT INTO fengshui(title, author, date, tag, content, coverImage, type, audio, intro) VALUES('${title}', '${author}', '${date}', '${tag}', '${content}', '${coverImage}', '${type}', '${audio}', '${intro}')`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, err));
                    console.log(err);
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
});

// 博客列表 (@params ?type= )
router.get('/list', (req, res, next) => {

    let sql = null;
    if (req.query.type) {
        sql = `SELECT * FROM fengshui where type=${req.query.type}`;
    } else {
        sql = `SELECT * FROM fengshui`;
    }

    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, err));
        } else {
            rows = rows.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    date: item.date,
                    content: item.content,
                    coverImage: item.coverImage,
                    abstract: item.abstract,
                    type: item.type,
                    audio: item.audio,
                    intro: item.intro,
                    tag: item.tag.split(',')
                }
            })
            res.send(Unity.send(200, 0, rows));
        }
    })

})

// 编辑博客
router.post('/updateBlog', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const {
                id,
                title,
                author,
                date,
                tag,
                type,
                intro,
                audio,
                content,
                coverImage
            } = req.body;
            const sql = `UPDATE fengshui SET title='${title}', author='${author}', tag='${tag}', content='${content}', coverImage='${coverImage}', type='${type}', audio='${audio}', date='${date}', intro='${intro}' where id='${id}'`
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, err));
                    console.log(err);
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})

// 删除博客
router.post('/delBlog', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const sql = `DELETE from fengshui where id = '${req.body.id}'`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})


// 获取博客分类
router.get('/getBlogType', (req, res, next) => {

    const sql = 'SELECT * FROM fengshui_type';
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })
})

// 新增博客分类
router.post('/addBlogType', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            console.log(token);
            const sql = `INSERT INTO fengshui_type(name) VALUE('${req.body.type}')`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })

})

// 删除博客分类
router.post('/delBlogType', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const sql = `DELETE from fengshui_type where id = '${req.body.id}'`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})


/**
 * 博客详情
 * @param = id
 */
router.get('/detail', (req, res, next) => {

    const sql = `SELECT * FROM fengshui WHERE id = '${req.query.id}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            rows = rows.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    date: item.date,
                    content: item.content,
                    coverImage: item.coverImage,
                    abstract: item.abstract,
                    intro: item.intro,
                    type: item.type,
                    audio: item.audio,
                    tag: item.tag.split(',')
                }
            })
            res.send(Unity.send(200, 0, rows));
        }
    })

})

// 上传图片
router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm();
    // form.encoding = 'utf-8';
    // 保留扩展名
    form.keepExtensions = true;
    // 文件存储路径，最后要加 '/' 否则会被存在public下
    // form.uploadDir = path.join(__dirname, '../public/images/');
    form.uploadDir = '/var/www/fsnode/static/source/';
    // 解析 formData 数据
    form.parse(req, (err, fields, files) => {
        if (err) return next(err);
        // console.log(files.file, 'files');
        // let imgPath = files.file.path;
        // let imgName = files.file.name;
        // console.log(imgName, imgPath);
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

// 登录
router.post('/login', (req, res) => {
    let account = req.body.account;
    let password = common.md5(req.body.password);
    // let password = common.md5(req.body.password + common.MD5_SUFFIX);
    let content = { name: req.body.account }; // 要生成token的主题信息
    let secretOrPrivateKey = "jwt";// 这是加密的key（密钥）
    let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60*60*24*30  // 30天过期
    });

    const sql = `SELECT * FROM fengshui_user WHERE account='${account}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'))
        } else {
            if (rows.length == 0) {
                res.send(Unity.send(500, 1, '账号不存在'))
            } else {
                if (rows[0].password == password) {
                    res.send(Unity.send(200, 0, token));
                } else {
                    res.send(Unity.send(500, 1, '密码错误'));
                }
            }
        }
    })
})

// 修改密码
router.post('/updatePsd', (req, res) => {
    let account = req.body.account;
    let password = common.md5(req.body.password);
    let newpassword = common.md5(req.body.newpassword);
    // let password = common.md5(req.body.password + common.MD5_SUFFIX);

    const sql = `SELECT * FROM fengshui_user WHERE account='${account}' and password='${password}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'))
        } else {
            if (rows.length == 0) {
                res.send(Unity.send(500, 1, '账号密码不正确'))
            } else {
                const sql2 = `UPDATE fengshui_user SET password='${newpassword}' where account='${account}'`
                db.query(sql2, (err2, rows2) => {
                    if (err2) {
                        res.send(Unity.send(500, 1, 'error'))
                    } else {
                        res.send(Unity.send(200, 0, 'success'))
                    }
                })
            }
        }
    })
})

// 获取banner图
router.get('/getBanner', (req, res, next) => {

    const sql = 'SELECT * FROM fengshui_banner';
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })
})

// 新增banner图
router.post('/addBanner', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            console.log(req.body, 'req.body')
            const sql = `INSERT INTO fengshui_banner(image, url, sort) VALUE('${req.body.image}', '${req.body.url}', '${req.body.sort}')`;
            console.log(sql, 'sql');
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})

// 修改banner图
router.post('/updateBanner', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const sql = `UPDATE fengshui_banner SET image='${req.body.image}', url='${req.body.url}', sort='${req.body.sort}' WHERE id='${req.body.id}'`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})

// 删除banner图
router.post('/delBanner', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const sql = `DELETE from fengshui_banner where id = '${req.body.id}'`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})

// 获取导航栏header
router.get('/getHeader', (req, res, next) => {

    const sql = 'SELECT * FROM fengshui_header';
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })
})

// 修改导航栏header
router.post('/updateHeader', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            const sql = `UPDATE fengshui_header SET url='${req.body.url}' WHERE id='${req.body.id}'`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                }
            })
        }
    })
})

// 获取匿名占卜
router.get('/getAnonymous', (req, res, next) => {

    const sql = 'SELECT * FROM fengshui_order WHERE status = 0';
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })
})

// 新增匿名占卜
router.post('/addAnonymous', (req, res, next) => {
    const now = new Date(req.body.time)
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    // 生成随机订单号
    function render(now, month, day, hour, minutes, seconds) {
        return now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 23 + 100)).toString()
    }
    // 格式化时间
    function momentTime(now) {
        return now.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
    }
    let time = momentTime(now, month, day, hour, minutes, seconds);
    let order = render(now, month, day, hour, minutes, seconds);
    // 查询订单号是否存在
    // const sql = `SELECT * FROM fengshui where type=${req.query.type}`
    const sql = `SELECT * FROM fengshui_order where orders=${order}`
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'errors'));
        } else {
            while (rows.length > 0) {
                order = render();
            }
            // 生成订单
            const sql = `INSERT INTO fengshui_order(orders, payOrder, question, time, status, hasUpdate) VALUE('${order}', '${req.body.payOrder}', '${req.body.question}', '${time}', '0', '0')`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err)
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, order));
                }
            })
        }
    })

})

// 匿名占卜解答 / 逻辑删除
router.post('/updateAnonymous', (req, res, next) => {
    let token = req.get('Authorization'); // 从Authorization中获取token
    let secretOrPrivateKey = "jwt"; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
            res.send(Unity.send(500, 1, 'token失效，请重新登录'))
        } else {
            let sql = '';
            if (req.body.status == 1) {
                // 逻辑删除
                sql = `UPDATE fengshui_order SET status='1' WHERE id='${req.body.id}'`;
            } else {
                // 修改
                sql = `UPDATE fengshui_order SET answer='${req.body.answer}' WHERE id='${req.body.id}'`;
            }
            db.query(sql, (err, rows) => {
                if (err) {
                    res.send(Unity.send(500, 1, 'error'));
                } else {
                    res.send(Unity.send(200, 0, 'success'));
                    // 删除服务器下的图片文件
                }
            })
        }
    })
})

// 匿名用户再次提问
router.post('/reQuestAnonymous', (req, res, next) => {
    sql = `UPDATE fengshui_order SET requestion='${req.body.question}', hasUpdate='0' WHERE orders='${req.body.order}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })
})

// 匿名用户更新解答
router.post('/updateAnswer', (req, res, next) => {
    sql = `UPDATE fengshui_order SET hasUpdate='1' WHERE id='${req.body.id}'`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, 'success'));
        }
    })
})

// 通过订单号查询占卜结果
router.post('/getAnoResult', (req, res, next) => {

    const sql = `SELECT answer, hasUpdate FROM fengshui_order WHERE orders=${req.body.order}`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.send(Unity.send(500, 1, 'error'));
        } else {
            res.send(Unity.send(200, 0, rows));
        }
    })
})

module.exports = router;