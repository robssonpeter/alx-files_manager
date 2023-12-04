const redisClient = require('../utils/redis.js');
const dbClient = require('../utils/db.js');

class AppController{
    getStatus(){
        return {
            redis: redisClient.isAlive(),
            db: dbClient.isAlive(),
        }
    }

    async getStats(){
        const user_count = await dbClient.nbUsers();
        const file_count = await dbClient.nbFiles();
        return {
            users: user_count,
            files: file_count,
        }
    }
}