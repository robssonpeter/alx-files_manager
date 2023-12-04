const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController extends dbClient {
  getStatus() {
    return {
      redis: redisClient.isAlive(),
      db: this.isAlive(),
    };
  }

  async getStats() {
    const userCount = await this.nbUsers();
    const fileCount = await this.nbFiles();
    return {
      users: userCount,
      files: fileCount,
    };
  }
}

module.exports = AppController;
