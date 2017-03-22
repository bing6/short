
/**
 * 路由配置 
 */
module.exports.routes = {
    
    //首页
    '/' : 'HomeController.homepage',

    //中转页
    '/:code': 'HomeController.transfer'
}