const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  getStatus() {
    return {
      redis: redisClient.isAlive(),
      db: this.isAlive(),
    };
  }

  async getStats() {
    try{
        const userCount = await dbClient.nbUsers();
        const fileCount = await dbClient.nbFiles();
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
