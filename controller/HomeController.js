
const qr = require('qr-image');
const _ = require('lodash');

const queue = 'shorturl';

module.exports = {

    /**
     * 首页
     */
    homepage: async function (ctx, next) {
        await ctx.render('index', {});
    },

    /**
     * 中转页
     * @param act 请求类型 默认跳转，qr为获取二维码
     * @param t 二维码图片类型svg,png,pdf
     */
    transfer: async function (ctx, next) {

        let code = ctx.params.code;
        //首先从redis获取短域名信息
        let data = await my.client.hgetall(code);
        //如果短域名信息不存在就去数据库里读取 'YZ7Z7r'
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
        //判断请求类型是生成二维码还是跳转
        if (ctx.query.act == 'qr') {
            let type = ctx.query.t || 'svg';
            if (type === 'svg') {
                ctx.type = 'image/svg+xml';
                ctx.body = qr.image(data.redirect_url, { type: 'svg' });
            } else {
                ctx.attachment(code + '.' + type);
                ctx.body = qr.image(data.redirect_url, { type: type });
            }
        } else {
            ctx.redirect(data.redirect_url);
        }
    }
}