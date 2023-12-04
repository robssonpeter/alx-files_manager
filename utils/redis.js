//import redis from 'redis';
//import { promisify } from 'util';
const redis = require('redis');
const {promisify} = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.log(`There is an error: ${error}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const resp = promisify(this.client.get).bind(this.client);
    return resp(key);
  }

  async set(key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }

  async del(key) {
    await this.client.del(key);
  }
}
const redisClient = new RedisClient();
module.exports = redisClient;
