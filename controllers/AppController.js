const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  constructor() {
    if (redisClient.redisError) {
      this.redisAlive = false;
    } else {
      this.redisAlive = true;
    }
    this.redisAlive = redisClient.isAlive();
    this.userCount = 0;
    this.filesCount = 0;
    this.dbAlive = dbClient.isAlive();
  }

  getStatus() {
    return {
      redis: redisClient.redisAlive,
      db: this.dbAlive,
    };
  }

  async getStats() {
    try {
      const userCount = await dbClient.nbUsers();
      this.userCount = userCount;
      /* dbClient.nbUsers().then((response) => {
        console.log('users retrived');
        console.log(response)
        this.userCount = 1;
      }); */
      const fileCount = await dbClient.nbFiles();
      /* dbClient.nbFiles().then((response) => {
        this.filesCount = response;
      }); */
      this.filesCount = fileCount;

      return {
        users: this.userCount,
        files: this.filesCount,
      };
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

module.exports = AppController;
