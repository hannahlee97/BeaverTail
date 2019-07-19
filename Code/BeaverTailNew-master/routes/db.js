var mysqlModel = require('mysql');


// var con = mysqlModel.createConnection({
//     host: "localhost",
//     user: "beavoafw_beavertail",
//     password: "beavertest1",
//     database: "beavoafw_beavertail"
//  });

var con = mysqlModel.createConnection({
    host: "remotemysql.com",
    user: "WuCiVprOyc",
    password: "o3omkCQO3a",
    database: "WuCiVprOyc"
 });

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!")
});


module.exports = con; 
