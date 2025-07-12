/**
 * @module service/redis
 * @description Configures and exports a Redis client for interacting with a Redis server.
 * 
 * @requires ioredis - Redis client for connecting and interacting with a Redis server.
 * @requires dotenv - Loads environment variables from a `.env` file for Redis configuration.
 * 
 * @configuration
 * - `host`: Redis server host, sourced from `REDIS_HOST` environment variable.
 * - `port`: Redis server port, sourced from `REDIS_PORT` environment variable.
 * - `username`: Redis server username, sourced from `REDIS_USER` environment variable.
 * - `password`: Redis server password, sourced from `REDIS_PW` environment variable.
 * 
 * @exports {Redis} - An instance of the Redis client configured with the environment variables.
 */
const Redis = require('ioredis');
const dotenv = require("dotenv")
dotenv.config()
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PW,
});

module.exports = redis