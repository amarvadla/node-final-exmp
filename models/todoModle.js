var {mongoose} = require('../mongoose/mong.js')

var TodoModel = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean , default : false
    },
    completedAt: {
        type: Number , default : 0
    }

});

module.exports = {TodoModel};