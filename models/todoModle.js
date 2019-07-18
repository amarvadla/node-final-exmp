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
    },
    _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }

});

module.exports = {TodoModel};