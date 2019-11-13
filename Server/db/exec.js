const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');

module.exports = {
    query: async (query, bindParam) => {
        let connection;
        let result;
    
        try {
            connection = await oracledb.getConnection(
                {
                    user: dbConfig.user,
                    password: dbConfig.password,
                    connectString: dbConfig.connectString
                }
            );
    
            result = await connection.execute(
                query,
                bindParam,
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    autoCommit: true
                }
            );
        } catch (err) {
            console.error(err);
            result = {error: err}
        } finally {
            if (connection) {
                try {
                    await connection.close();
                    return result;
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    sp: async (query, bindParam) => {
        let connection;
        let result;
        query += ";";
    
        try {
            connection = await oracledb.getConnection(
                {
                    user: dbConfig.user,
                    password: dbConfig.password,
                    connectString: dbConfig.connectString
                }
            );
    
            result = await connection.execute(
                query,
                bindParam,
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    autoCommit: true
                }
            );
        } catch (err) {
            console.error(err);
            result = {error: err}
        } finally {
            if (connection) {
                try {
                    await connection.close();
                    return result;
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    execute: (query, bindParam) => {
        return new Promise(
            async (res, rej) => {
                let conn;

                try {
                    conn = await oracledb.getConnection(
                        {
                            user: dbConfig.user,
                            password: dbConfig.password,
                            connectString: dbConfig.connectString
                        }
                    );
                    const result = await conn.executeMany(
                        query,
                        bindParam
                    );
                    conn.commit();
                    res(result);
                } catch (err) {
                    rej(err.message);
                } finally {
                    if (conn) {
                        try {
                            await conn.close();
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
        )
    }
}
