var express = require('express');
var bodyParser = require('body-parser');
var { TodoModel } = require('./models/todoModle');
var { userModel } = require('./models/userModel');
var _ = require('lodash');

var app = express();
const port = process.env.PORT || 8081;

app.use(bodyParser.json());

app.post('/addUser', (req, res) => {
    console.log(req.body);

    var todo = new TodoModel({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log('saved');
        res.send({
            "status code": 1,
            "status message": "saved successfully"
        }
        );
    });
});

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    userModel.findToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
}

app.get('/todos', authenticate, (req, res) => {

    TodoModel.find({
        _creator: req.user._id
    }).then((data) => {
        console.log(data);
        res.send({
            "statusCode": 1,
            "data": data
        });
    }).catch((e) => {
        console.log(e);
    });

});

app.post('/todo', authenticate, (req, res) => {

    var todo = new TodoModel({
        'text': req.body.text,
        '_creator': req.user._id
    })

    todo.save().then((data) => {
        res.send(data);
    }, (e) => {
        res.send(e);
    })

});

app.get('/user/me', authenticate, (req, res) => {
    res.send(req.user.simpleObj());
});

app.post('/user/login', (req, res) => {
    var reqBody = _.pick(req.body, ['email', 'password']);

    userModel.login(reqBody.email, reqBody.password).then((user) => {
        console.log(user)
        return user.generateAuthToken().then((token) => {
            console.log(token);
            res.header('x-auth', token).send(user.simpleObj());
        });
    }).catch((e) => {
        res.send({
            'statusCode': 0,
            'statusMessage': 'wrong credentials',
            'error': e
        })
    });

});

app.delete('/user/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.send(400).send();
    });
});

app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new userModel(body);

    user.save().then(() => {
        // res.send(data)
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user.simpleObj());
    }).catch((e) => {
        res.status(400).send(e)
    })
})


var server = app.listen(port, () => {
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