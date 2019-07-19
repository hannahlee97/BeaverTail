const router = require('./index');
const passwordHash = require('password-hash');
var nodemailer = require('nodemailer');
const con = require("./db"); 





var obj = {};
let ssn;

router.get('/account', function(req, res){
    ssn = req.session;
    if (ssn.Role != 1){
        res.redirect('/');
    }
	else{
    con.query('SELECT * FROM register_user', function(err, result) {

        if(err){
            throw err;
        }
        else {
            obj = result;  
           
            res.render('account.ejs', {print:result,length:result.length,count:0});                
        }
        });
	}

});

router.get('/current_account', function(req, res){
    ssn = req.session;
    if (ssn.Role != 1){
        res.redirect('/');
    }
	else{
    con.query('SELECT * FROM users', function(err, result) {

        if(err){
            throw err;
        }
        else {
            obj = result;  
            res.render('current_account.ejs', {print:result,length:result.length,count:0});                
        }
        });
	}

});


router.post('/current_account/ban',function(req,res){
    var data = req.body.user;

   if(typeof  data!== "undefined"){
       for(i = 0 ; i < data.length ; i++){
           let j = data[i];
           let username = obj[j].username;
           let sql = "UPDATE users SET status = '" + "block" + "' WHERE username = '" + username + "'";           
           con.query(sql, function (err, result) {
           if (err) throw err;
           });
       }               
   }
   res.redirect("/current_account"); 
});

router.post('/current_account/unban',function(req,res){
    var data = req.body.user;
    console.log("This is data: " + data);

   if(typeof data!== "undefined"){
       for(i = 0 ; i < data.length ; i++){
           let j = data[i];
           let username = obj[j].username;
           let sql = "UPDATE users SET status = '" + "ava" + "' WHERE username = '" + username + "'";           
           con.query(sql, function (err, result) {
           if (err) throw err;
           });
       }              
   }
   res.redirect("/current_account");  
   
});


router.post('/account/delete', function(req, res){
    var data = req.body.user;
    if(typeof data !== "undefined"){
        for(i = 0 ; i < data.length ; i++){
            let j = data[i];
            let username = obj[j].username;
            let remove = "Delete From register_user WHERE username  = '" + username + "'";
            con.query(remove,function(err,result){
                if(err){
                    throw err;
                    }
                });
            }
        }
        console.log("User Remove");
        res.redirect("/account");
});
    

    router.post('/account/approve',function(req,res){
         var data = req.body.user;
        if(typeof data !== "undefined"){
            for(i = 0 ; i < data.length ; i++){
                let j = data[i];
                let username = obj[j].username;
                let email = obj[j].email;
                let password = passwordHash.generate(obj[j].password);
                let sql = "INSERT INTO users (username,email,password) VALUES ('" + username + "', '" + email + "', '" + password + "')";
                con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                });
                emailSend(email,obj[j].password);
            }
            let remove = "Delete From register_user WHERE username IN(SELECT username FROM users)";
            con.query(remove,function(err,result){
            if(err){
                throw err;
                }
            });
            con.query('SELECT * FROM register_user', function(err, result) {
            if(err){
                throw err;
            }
            else {
               res.redirect("/account");              
            }
            });
        }
        
    });

    function emailSend(email,password){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var transporter = nodemailer.createTransport({
            host:'mail.beavertail.me',
            port:26,
            auth: {
              user: 'beavertail2019@beavertail.me',
              pass: 'ANmSOhYwU6TX'
            }
          });
 
          var mailOptions = {
            from: 'beavertail2019@beavertail.me',
            to: email,
            subject: 'Approve From BeaverTail',
            text: 'This is your password: ' + password
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
