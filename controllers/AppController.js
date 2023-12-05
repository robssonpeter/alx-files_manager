const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  constructor() {
    this.redisAlive = redisClient.isAlive();
    dbClient.isAlive().then((response) => {
      this.dbAlive = response;
    });
  }

  getStatus() {
    return {
      redis: this.redisAlive,
      db: this.dbAlive,
    };
  }

  async getStats() {
    try {
      // const userCount = await dbClient.nbUsers();
      console.log(dbClient);
      dbClient.nbUsers().then((response) => {
        this.userCount = response;
      });
      // const fileCount = await dbClient.nbFiles();
      dbClient.nbFiles().then((response) => {
        this.filesCount = response;
      });

      return {
        users: this.userCount,
        files: this.filesCount,
      };
    }catch(error){
      console.log(error);
    }
    
  }
}

module.exports = AppController;
