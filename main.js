const express = require('express');

var exp =  express();

exp.get('/', (req,res) => {
    res.send("hello js")
});

exp.listen(3030);