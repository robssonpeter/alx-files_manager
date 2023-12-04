const {MongoClient} = require('mongodb');
class DBClient{
    constructor (){
        let host = process.env.DB_HOST??'localhost';
        let port = process.env.DB_PORT??27017;
        let database = process.env.DB_DATABASE??'files_manager';
        const url =  `mongodb://${host}:${port}/${database}`;
        this.client = new MongoClient(url);
        this.client.connect();
    }

    async isAlive(){
        try {
            await this.client.connect();
            return true;
          } catch (error) {
            return false;
          } finally {
            await this.client.close();
          }
    }

    async nbUsers(){
        try {
            await this.client.connect();
            const db = this.client.db();
            const usersCollection = db.collection('users');
            const count = await usersCollection.countDocuments();
            return count;
        } finally {
            await this.client.close();
        }
    }

    async nbFiles(){
        try {
            await this.client.connect();
            const db = this.client.db();
            const filesCollection = db.collection('files');
            const count = await filesCollection.countDocuments();
            return count;
        } finally {
            await this.client.close();
        }
    }
}

const dbClient = new DBClient();
module.exports = dbClient;