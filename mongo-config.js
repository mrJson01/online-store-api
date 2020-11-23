const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin-user:C80j1JZC0iL5LPgl@cluster0.x1pqv.mongodb.net/store_inner?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true});

module.exports = client;

// ----------------It is possible that password has expired time
// C80j1JZC0iL5LPgl