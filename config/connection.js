
module.exports.connections = {

    /***************************************************************************
    *                                                                          *
    * MySQL is the world's most popular relational database.                   *
    * http://en.wikipedia.org/wiki/MySQL                                       *
    *                                                                          *
    * Run: npm install mysql                                                   *
    *                                                                          *
    ***************************************************************************/

    developmentMySqlServer: {
        host: '192.168.2.14',
        user: 'root',
        password: '123456',
        port: 32769,
        database: 'mydb',
        pool: {
            max: 25,
            min: 5,
            idle: 10000
        }
    },

    productionMySqlServer: {
        host: '192.168.2.14',
        user: 'root',
        password: '123456',
        port: 32769,
        database: 'mydb',
        pool: {
            max: 25,
            min: 5,
            idle: 10000
        }
    },

    /***************************************************************************
    *                                                                          *
    * Redis is the world's most popular NoSQL database.                        *
    * http://en.wikipedia.org/wiki/MySQL                                       *
    *                                                                          *
    * Run: npm install redis                                                   *
    *                                                                          *
    ***************************************************************************/

    developmentRedis: {
        host: '192.168.2.14',
        port: 32768
    },

    productionRedis: {
        host: '192.168.2.14',
        port: 32768
    },
}