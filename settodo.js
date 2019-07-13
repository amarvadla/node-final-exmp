var express = require('express');
var app = express();

app.post('/addUser', function (req, res) {
   // First read existing users.
    console.log(res);
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})