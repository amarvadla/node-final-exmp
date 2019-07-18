// const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bycrpt = require('bcryptjs');

// var data = {
//     id: 10
// }

// var token = jwt.sign(data, 'amar@3696');
// console.log(token);

// var decode = jwt.verify(token, 'amar@3696');
// console.log('decode', decode);

var password = 'amar@3696';

bycrpt.genSalt(10).then((salt) => {
    bycrpt.hash(password, salt, (err, hash) => {
        console.log(hash);
        bycrpt.compare(password, hash).then((res) => console.log(res));
    })
})

