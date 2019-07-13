var express = require('express');
var bodyParser = require('body-parser');
var {TodoModel} = require('./models/todoModle');

var app = express();
const port = process.env.PORT || 8081;

app.use(bodyParser.json());

app.post('/addUser', (req,res) => {
    console.log(req.body);
    
    var todo = new TodoModel({
        text : req.body.text
    });

    todo.save().then((doc)=>{
        console.log('saved');
    });
});

app.get('/todos', (req,res)=>{

    TodoModel.find().then((data) => {
        console.log(data);
        res.send({
            "statusCode": 1,
            "data" : data
        });
    }).catch((e)=>{
        console.log(e);
    })

})

var server = app.listen(port , () => {
    console.log(`listening to ${port}`);
});


// var newTodo = new Todo({
//     text: 'wake up and go to gym'
// });

// newTodo.save().then((doc) => {
//     console.log(doc);
// }, (e) => {
//     console.log(e);
// });