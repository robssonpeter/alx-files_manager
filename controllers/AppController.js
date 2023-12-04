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
    try{
        const userCount = await this.nbUsers();
        const fileCount = await this.nbFiles();
        return {
          users: userCount,
          files: fileCount,
        };
    }catch(error){
        console.log(error);
    }
    
  }
}

module.exports = AppController;
