var { mongoose } = require('../mongoose/mong');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bycrpt = require('bcryptjs');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.simpleObj = function () {
    var user = this;
    var userObject = user.toObject();

    var body = _.pick(userObject, ['_id', 'email']);

    return body;
}

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();


    // user.tokens.push({ access, token });
    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => {
        return token;
    }
    );
}

userSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

userSchema.statics.findToken = function (token) {
    var user = this;
    var decode;

    try {
        decode = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    return user.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

userSchema.statics.login = function (email, password) {

    var user = this;

    return user.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bycrpt.compare(password, user.password, (err, bool) => {
                // console.log(bool);
                if (bool) {
                    // console.log(user)
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    })
}

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bycrpt.genSalt(10).then((salt) => {
            bycrpt.hash(user.password, salt, (err, hash) => {
                if (hash) {
                    user.password = hash;
                    next();
                }
            }).catch((e) => {
                console.log(e);
                next();
            })
        })

    } else {
        next();
    }

});

var userModel = mongoose.model('user', userSchema);

module.exports = { userModel };