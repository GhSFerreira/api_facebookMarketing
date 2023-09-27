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
    return insertResult;
  } catch (error) {
    console.error(error);
  }
}

async function deleteDocument(collection, data){
  try {
    const deletedResult = await database.collection(collection).deleteOne(data);
    return deletedResult;
  } catch (error) {
    console.error(error);
  }
}

async function clearCollection(mongoCollection) {
  if (mongoCollection) {
    try {
      const deleted = await client.db(dbName).collection(mongoCollection).deleteMany({});
      console.log(`Collection ${mongoCollection} deleted succesfully! ${deleted.deletedCount} objects deleted`);
      return deleted;
    } catch (error) {
      console.error(`Error: clerCollection => ${error.message}`);
      return 0;
    }
  } else {
    throw Error({message: 'colletion not provided to clearColletion'})
  }
}

async function getData(collectionName, options = {}) {
  if (!collectionName || !options){
    return Error({error: {code: 1, message: 'collectionName or params nor declared at getData params => databaseConnection'}})
  }else{
    const collection = await client.db(dbName).collection(collectionName).find().toArray();
    return collection
  }
}

module.exports= {createConnection, terminateConnection, insertData, clearCollection, getData, deleteDocument}

