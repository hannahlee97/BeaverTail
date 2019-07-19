const router = require('./index');
var con = require('./db');
const multer = require('multer');
const path = require("path");

const multerConf = {
    storage : multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/images/');
        },
        filename: function(req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            console.log(file);
        }
    })
};


router.get('/createNews', function(req, res, next) {
    let ssn = req.session;
    console.log("UserName= " +ssn.userName);
    if (ssn.userName == null){
        res.redirect('/');
    }else{
    res.render('createNews');
    }
});


router.post('/submitNews', multer(multerConf).single('image'), function(req, res, next) {
    console.log(req.body);
    let ssn = req.session;
    let title = req.body.title;
    let body = req.body.body;
    let tags = req.body.tags;
    let url = req.body.url;
    let image = req.file.filename;
    
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("Image: " + image);
    let sql = "INSERT INTO newsArticles (userName, title, body, date, tags, url, image) VALUES ('" + ssn.userName + "', '" + title + "', '" + body + "', '" + date + "','" +  tags + "', '" + url + "', '" + image + "')";
    con.query(sql, function (err, result) {
        if (err){
            throw err;
        } 
        console.log("Record inserted successfully");
        res.redirect('/');
    });
});


router.get('/viewmapnews', function(req, res, next) {
let sql = "select * from newsArticles"; 

    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.render("map", {
          article: result
        });
    });
});