const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',
(err,client)=>{

    if(err){
        return console.log(err);
    }
    const db = client.db('TodoApp')
    

    // db.collection('users').insertOne({
    //     name:'vicky',
    //     age:25,
    //     gender:'male'
    // },(err,data)=>{
    //     if(err)
    //     console.log(err)

    //     console.log(JSON.stringify(data.ops,undefined,2));
    // })


    // db.collection('users').find({age:24}).toArray().then((data)=> {
    //     console.log(JSON.stringify(data,undefined,2))
    // }, (err) => {
    //     console.log(err);
    // });

    db.collection('users').findOneAndUpdate({
        name: 'amar'
    },{
        $inc : {age: -1}
    },{
        returnOriginal : false
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err)
    })

    client.close();

});