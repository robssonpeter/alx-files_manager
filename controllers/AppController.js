const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController{
  constructor(){
    this.redisAlive = redisClient.isAlive();
    dbClient.isAlive().then(response => {
        console.log('things are happening here now');
        this.dbAlive = response;
    })
  }
  getStatus() {
    return {
      redis: this.redisAlive,
      db: this.dbAlive,
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
