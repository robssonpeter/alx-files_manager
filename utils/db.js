const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    const database = process.env.DB_DATABASE ? process.env.DB_DATABASE : 'files_manager';
    const url = `mongodb://${host}:${port}`;
    this.database = database;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    /* this.client.db(database);
    this.client.connect(); */
  }

  isAlive() {
    try {
      this.client.connect();
      return true;
    } catch (error) {
      return false;
    }/*  finally {
      await this.client.close();
    } */
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      console.log(error);
    } /* finally {
      await this.client.close();
    } */
    return null;
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const filesCollection = db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (error) {
      console.log(error);
    }/* finally {
      await this.client.close();
    } */
    return null;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
