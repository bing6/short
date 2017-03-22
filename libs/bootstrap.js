
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const redis = require('redis');
const wrapper = require('co-redis');

module.exports = function () {
    //环境配置
    let env = process.env.NODE_ENV === 'production' ? require('../config/env/production') : require('../config/env/development');
    //配置路径
    let confPath = path.resolve(__dirname, '../config');
    //模型路径
    let modelPath = path.resolve(__dirname, '../models');
    //全局配置
    let conf = { env };
    //合并所有配置信息
    fs.readdirSync(confPath).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    }).forEach(function (file) {
        var model;
        try {
            model = require(path.join(confPath, file))
        } catch (e) {
            console.error(e);
        }
        conf = _.merge(conf, model || {});
    });
    //获取MySQL数据库连接配置
    let mysql = conf.connections[env.mysql];
    let sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
        dialect: 'mysql',
        host: mysql.host,
        port: mysql.port,
        pool: mysql.pool
    });
    //合并数据库模型
    let db = {};
    fs.readdirSync(modelPath).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    }).forEach(function (file) {
        try {
            let model = require(path.join(modelPath, file))(sequelize);
            db[model.name] = model;
            model.sync();
            // model.sync({force: true});
        } catch (e) {
            console.error(e);
        }
    });
    let redisConf = conf.connections[env.redis];
    let client = wrapper(redis.createClient(redisConf.port, redisConf.host, {}));
    global['my'] = { db, conf, env, client };
}