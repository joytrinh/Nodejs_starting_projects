const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
let _db

const mongoConnect = cb => {
    MongoClient.connect(
        'mongodb+srv://tuyentrinh:tuyen1234@cluster0-7dvwp.azure.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(client => {
        console.log('Connected')
        _db = client.db()//store the access to the database. 'shop': a database which is new or existing will replace 'test' on the url above
        cb()
    })
    .catch(err => {
        console.log(err)
        throw err
    })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found'
}
 
exports.mongoConnect = mongoConnect
exports.getDb = getDb