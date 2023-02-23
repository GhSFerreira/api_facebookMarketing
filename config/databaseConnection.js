const { MongoClient , ServerApiVersion } = require('mongodb');

// Connection URL
const url = process.env.MONGODB_URL;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Database Name
const dbName = process.env.MONGODB_DBNAME;

var database;

async function createConnection() {
  // Use connect method to connect to the server
  try {
      await client.connect();
      database = await client.db(dbName);
      console.log('Connected successfully to server');
  } catch (error) {
    console.error(error);
  }
}

async function terminateConnection() {
  try {
    client.close()
    console.log('********* MongoDB Server disconected! ******');
  } catch (error) {
    console.error(error);
  }
}

async function insertData(collection, data) {
  try {
    const insertResult = await database.collection(collection).insertMany(data);
    console.log('Inserted documents =>', insertResult);
    return insertResult;
  } catch (error) {
    console.error(error);
  }
}

module.exports= {createConnection, terminateConnection, insertData}

//createConnection()
