
const _ = require('lodash');
const URL = require('valid-url');
const Short = require('../libs/short');

function _URLDataToJSON(data) {
    return {
        redirect_url: data.redirect_url,
        url: data.url,
        qr: data.url + '?act=qr&t=png',
        code: data.code
    }
}

module.exports = {

    /**
     * 获取短域名信息
     */
    find: async function (ctx, next) {
        let code = ctx.params.code;
        //首先从redis获取短域名信息
        let data = await my.client.hgetall(code);
        //如果短域名信息不存在就去数据库里读取 
        if (!data) {
            data = await my.db.ShortURL.findOne({
                where: { code: code }
            });
            //如果数据库里也不存在就抛404错误
            if (data) {
                data = data.toJSON();
                //散列存储
                await my.client.hmset(code, data);
            } else {
                ctx.status = 404;
                return await next();
            }
        }
        ctx.body = _URLDataToJSON(data);
    },

    /**
     * 生成短域名
     */
    generate: async function (ctx, next) {
        //获取请求参数
        let params = ctx.request.body;
        //判断参数是否为空或是否格式正确
        if (_.isEmpty(params.u) || !URL.isUri(params.u)) {
            ctx.status = 412;
        } else {

            let short_code = Short.encode(params.u);
            let data = await await my.db.ShortURL.findOne({
                where: { code: short_code[0] }
            });
            if (data) {
                ctx.body = _URLDataToJSON(data);
            } else {
                data = {
                    code: short_code[0],
                    full_code: _.join(short_code, "-"),
                    url: "http://" + ctx.host + "/" + short_code[0],
                    redirect_url: params.u
                }
                try {
                    let result = (await my.db.ShortURL.create(data)).toJSON();
                    await my.client.hmset(result.code, result);
                    ctx.body = _URLDataToJSON(result);
                } catch (e) {
                    console.error(e);
                    ctx.status = 500;
                }
            }
        }
    }
}