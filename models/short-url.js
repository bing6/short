

const Sequelize = require('sequelize');

/**
 * 短域名信息表
 */
module.exports = function (sequelize) {
    //定义数据表字段
    let attribus = {
        //自增主键
        short_url_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
        //生成短域名阉割版
        code: { type: Sequelize.STRING(10), unique: true },
        //生成短域名编码完整版
        full_code: { type: Sequelize.STRING(255) },
        //新的URL
        redirect_url: { type: Sequelize.STRING(255) },
        //旧的URL
        url: { type: Sequelize.STRING(1024) }
    };
    //配置数据表
    let options = {
        //关闭表名复数
        freezeTableName: true,
        //表名
        tableName: 'short_url',
        //禁止创建CreateAt,UpdateAt
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        //自增ID,从1000开始
        autoIncrement: 1000
    };
    return sequelize.define('ShortURL', attribus, options);
}
