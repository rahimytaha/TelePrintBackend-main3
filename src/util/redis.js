const redis = require('redis');
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD} = require('./../config/index');
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
})

function RedisGet(key) {
    return new Promise((resolve, reject) => {
        client.get(String(key), function(err, res) {
        if (err) {
            reject(err)
        }
        resolve(res)
        })
    })
}
function RedisDelete(key) {
    return new Promise((resolve, reject) => {
        client.del(String(key), function(err, res) {
        if (err) {
            reject(err)
        }
        resolve(res)
        })
    })
}
function RedisSetExpireDate(key, value, expireDate) {
    return new Promise((resolve, reject) => {
        client.setex(String(key), expireDate, JSON.stringify(value), function(err, res) {
        if (err) {
            reject(err)
        }
        resolve(res)
        })
    })
}

module.exports = {
    RedisDelete,
    RedisGet,
    RedisSetExpireDate
}