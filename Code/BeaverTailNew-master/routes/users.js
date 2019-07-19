
    const router = require('./index');
    const multer = require('multer');
    const path = require("path");
    const con = require("./db"); 

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

   



    router.get('/editprofile', function(req,res){
        let user;
        ssn = req.session;
        
        let sql = "select * from users WHERE username = '" + ssn.userName + "'"; 
        let sql2 = "select title from newsArticles WHERE userName = '" + ssn.userName + "'"; 
        
        con.query(sql2, function (err, result) {
            if (err){
                throw err;
            } 
            ssn.article = result;
          
           

        });

        con.query(sql, function (err, result) {
            if (err){
                throw err;
            } 
            console.log(result);
            console.log(ssn.article);
            
            
            ssn.id = result[0].id;
            ssn.userName = result[0].username;
            ssn.password = result[0].password;
            ssn.name =  result[0].name;
            ssn.email = result[0].email;
            ssn.bio = result[0].bio;
            ssn.socialmedia = result[0].socialmedia;
            ssn.role = result[0].role;
            ssn.image = result[0].image;
            res.render('profile', {
                id: result[0].id,
                username: result[0].username,
                password: result[0].password,
                name: result[0].name,
                email: result[0].email,
                bio: result[0].bio,
                socialmedia: result[0].socialmedia,
                role: result[0].role,
                image: result[0].image,
                article:  ssn.article
                
            });
        });
     });






 router.post('/editbio', function(req,res){
    let bio = req.body.bio;
    console.log(bio);
    let sql = "UPDATE users SET bio = '" + bio + "' WHERE username = '" + ssn.userName + "'"; 

    con.query(sql, function (err, result) {
        if (err){
            throw err;
        } 
        
        res.redirect('/editprofile');
    });
 });

 router.post('/editsocialmedia', function(req,res){
    let socialmedia = req.body.socialmedia;
    console.log(socialmedia);
    let sql = "UPDATE users SET socialmedia = '" + socialmedia + "' WHERE username = '" + ssn.userName + "'"; 

    con.query(sql, function (err, result) {
        if (err){
            throw err;
        } 
        
        res.redirect('/editprofile');
    });
 });



 router.post('/editemail', function(req,res){
    let email = req.body.email;
    console.log(email);
    let sql = "UPDATE users SET email = '" + email + "' WHERE username = '" + ssn.userName + "'"; 
    let check = "SELECT email FROM users WHERE email = '" + email + "'";


    con.query(check, function(err, result){
        if (err){
            throw err;
        }
        else if(result.length>0){
            console.log("email already exist");
            message = 'email already exist.';
            ssn = req.session;
            res.render('profile.ejs',{
                id: ssn.id,
                username: ssn.username,
                password: ssn.password,
                name: ssn.name,
                email: ssn.email,
                bio: ssn.bio,
                socialmedia: ssn.socialmedia,
                role: ssn.role,
                image: ssn.image,
                message: message
            });
            
          
                        
        }else{
            con.query(sql, function (err, result) {
                if (err){
                    throw err;
                } 
                
                res.redirect('/editprofile');
            });
        }
         
     });
    
 });

 router.post('/editname', function(req,res){
    let name = req.body.name;
    console.log(name);
    let sql = "UPDATE users SET name = '" + name + "' WHERE username = '" + ssn.userName + "'"; 

    con.query(sql, function (err, result) {
        if (err){
            throw err;
        } 
        
        res.redirect('/editprofile');
    });
 });

 router.post('/uploadimage', multer(multerConf).single('image'), function(req, res, next) {
    let image = req.body.image;
    
    if (req.file) {
        req.body.image = req.file.filename;
        image = req.body.image;
        let sql = "UPDATE users SET image = '" + image + "' WHERE username = '" + ssn.userName + "'";
        
        con.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            console.log("POST image: " + image);
            res.redirect('/editprofile');   
        });
    }
    image = req.body.image;
});



router.get('/viewarticle/:title', function(req,res){
    
    let sql = "select * from newsArticles WHERE title = '" + req.params.title + "'";
    let ssn = req.session;
    let body;
    let images;
    ssn.title = req.params.title;
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        ssn.articleId = result[0].id;
        body = result[0].body;
        images = result[0].image;
       

    let com = "select * from comments WHERE articleId = '" + ssn.articleId + "'";
    con.query(com, function(err, result2) {
        if (err) {
            throw err;
        }
        res.render("viewarticle", {
            title: req.params.title,
            news: body,
            picture:images,
            comms: result2,
            sess: ssn
            });
        });

    });

    

 });

 router.post('/postComment/:title', function(req,res){
    let ssn = req.session;
    console.log("this is title: " + req.params.title);
    let sql = "INSERT INTO comments (articleId,userName,articleTitle,comment) VALUES ('" + ssn.articleId + "', '" + ssn.userName + "', '" + req.params.title +"', '" + req.body.comment + "')";
    console.log("testing comment:" + ssn.articleId);

    let sql2 = "UPDATE newsArticles SET commentCount = commentCount + 1 WHERE Title = '" + req.params.title + "'";
    //Updating comment count first
    con.query(sql2, function(err, result) {
        if (err) {
            throw err;
        }
    });

    //Inserting comment into database
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.redirect("/viewarticle/"+req.params.title);
    });
 });
