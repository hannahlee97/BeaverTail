var express = require('express');
var router = express.Router();
const passwordHash = require('password-hash');
const con = require("./db"); 




//Session variable
let ssn;


//DB UserName: 8Acl20RecM
//DB Password: HCdGLB7FRz

/* GET home page. */
router.get('/', function(req, res){
    ssn = req.session;
    let mostPopular;
    //Selecting most recent articles
    let sql = "SELECT Title, image, DATE_FORMAT(date,\'%m-%d-%Y\') as date FROM newsArticles ORDER BY date DESC LIMIT 8";
    
    //Selecting most popular articles
    let sql2 = "SELECT Title, image, DATE_FORMAT(date,\'%m-%d-%Y\') as date , commentCount FROM newsArticles ORDER BY commentCount DESC LIMIT 4";
    //Selecting articals for map
    let sql3 = "select Title, body, longitude, latitude from newsArticles where date >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"; 

    con.query(sql3, function (err, result3) {
        if (err){
            throw err;
        } 
        con.query(sql, function (err, result) {
            if (err){
                throw err;
            } 
            con.query(sql2, function (err, result2) {
                if (err){
                    throw err;
                } 
                console.log("Most popular: " + JSON.stringify(result2));
                console.log("Most recent: " + JSON.stringify(result));
               
                res.render('index.ejs',{
                    session: ssn,
                    recentArticles: result,
                    mostPopular: result2,
                    maparticle: result3
                });
            });
        }); 
    });
   
 });

 router.get('/login', function(req, res){
  let Loginmessage="";
  res.render('login.ejs',{message:Loginmessage});
 });



 router.get('/signup', function(req, res){
   let SignUpmessage = "";
   res.render('signup.ejs',{message:SignUpmessage});
 });

 router.post('/signup',function(req,res){

    var username = req.body.username;
    var email = req.body.email;
    var random_password = Math.random().toString(36).slice(-8);
    let sql = "INSERT INTO register_user (username,email,password) VALUES ('" + username + "', '" + email + "', '" + random_password + "')";
    //check username exist or not

    let check_username = "SELECT username FROM users WHERE username = '" + username + "'";
    let check_register_user = "SELECT username FROM register_user WHERE username = '" + username + "'";
    let user_mail =  "SELECT email FROM users WHERE email = '" + email + "'";
    let register_mail =  "SELECT email FROM register_user WHERE email = '" + email + "'";

   // check username
   con.query(check_username,function(err,result){
       if (err){
           throw err;
       }
       if(result.length > 0){
           message = 'User already exist.';
           res.render('signup.ejs',{message: message});
       }else{
           con.query(check_register_user, function(err, result){
               if (err){
                   throw err;
               }
               else if(result.length>0){
                   console.log("user already exist");
                   message = 'User already exist.';
                   res.render('signup.ejs',{message: message});

                // check email
               }else{
                   con.query(user_mail,function(err,result){
                       if (err){
                           throw err;
                       }
                       if(result.length > 0){
                           console.log("email already used");
                           message = 'Email already used.';
                           res.render('signup.ejs',{message: message});
                       }else{
                           console.log("email checking");
                           con.query(register_mail,function(err,result){
                               if (err){
                                   throw err;
                               }
                               if(result.length > 0){
                                   console.log("email already used");
                                   message = 'Email already used.';
                                   res.render('signup.ejs',{message: message});
                               }else{

                                    //user insert
                                   con.query(sql, function (err, result) {
                                   if (err) throw err;
                                       console.log("1 record inserted");
                                   res.redirect('/');
                                   });

                               }
                           });
                       }
                   });
               }

            });
       }
   });

});

router.post('/login', function(req, res, next) {
    let errors = [];
    let username = req.body.username;
    
    let password = req.body.password;

    
    //Checking to see if username exists in DB
    let sql = "SELECT username FROM users WHERE username = '" + username + "'";
    
    con.query(sql, function(err, result){
        if (err){
            throw err;
        }
        if(result.length > 0){
            console.log("User exists");
            //If username exists we can get the hashed password
            let sql2 = "SELECT password,role,status FROM users WHERE username = '" + username + "'";
            con.query(sql2, function(err, result){
                if (err){
                    throw err;
                }
                let hashedPassword = result[0].password;
                let status = result[0].status;
                console.log("status: "+status);
                let role = result[0].role;
                console.log(passwordHash.verify(password, hashedPassword));
                //Verify plain-text password user enteres matches hash from DB
                if(passwordHash.verify(password, hashedPassword) && status != "block"){
                    //Clear error array upon succesful login
                    errors = [];
                    //Setting session variable
//                    ssn = req.session;
//                    ssn.userName = uName;
                    console.log("welcome " + username)
                    ssn = req.session;
                    ssn.userName = username;
                    console.log("test" + ssn.userName);
                    ssn.Role = role;
                    console.log(ssn.Role);
                    console.log(ssn);
                    res.redirect('/');
                }else if(passwordHash.verify(password, hashedPassword) && status == "block"){
                   message = 'Account was banned.';
                   res.render('login.ejs',{
                       message: message                     
                    });
                }else{
                    message = 'Password is incorrect.';
                    res.render('login.ejs',{
                        message: message                     
                     });
                }
            });
        }else{
            console.log("User does NOT exist");
            let message = 'User NOT exist.';
            res.render('login.ejs',{message: message});
        }        
    });
});
    
    
    
 router.get('/logout', function(req,res){
  req.session.destroy();
  res.redirect('/');
 });


 router.post('/newsDate', function(req, res){
    let newsDate = req.body.newsDate;
    console.log("DATE: " + newsDate);
    ssn = req.session;
    let mostPopular;
    //Selecting most recent articles
    let sql = "SELECT Title, image, date FROM newsArticles ORDER BY date DESC LIMIT 8";
    //Selecting most popular articles
    let sql2 = "SELECT Title, image, date, commentCount FROM newsArticles ORDER BY commentCount DESC LIMIT 4";
    //Selecting articals for map
    let sql3 = "select Title, body, longitude, latitude from newsArticles WHERE date(date) = '" + newsDate + "'"; 

    con.query(sql3, function (err, result3) {
        if (err){
            throw err;
        } 
        con.query(sql, function (err, result) {
            if (err){
                throw err;
            } 
            con.query(sql2, function (err, result2) {
                if (err){
                    throw err;
                } 
                console.log("Most popular: " + JSON.stringify(result2));
                console.log("Most recent: " + JSON.stringify(result));
               
                res.render('index.ejs',{
                    session: ssn,
                    recentArticles: result,
                    mostPopular: result2,
                    maparticle: result3
                });
            });
        }); 
    });
   
 });

module.exports = router;