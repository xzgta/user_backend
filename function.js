const modules = require("./modules.js");

module.exports.isAuthenticated = function(req, res, next) {

    try {
        if (!("authorization" in req.headers) && !("authorization" in req.query)) throw {
            code: 401,
            message: "Akses ditolak"
        }
    } catch (e) {
        return res.status(e.code).json({
            status: false,
            code: e.code,
            message: e.message
        })
    }

    // Variable
    let auth = ("authorization" in req.headers) ? req.headers.authorization : req.query.authorization,
        token = auth.split('Bearer ')[1].split(',')[0],
        sql_array = [],
        sql = ""

    modules.jwt.verify(token, process.env.SALT, function(err, decoded) {
        try {
            if (err) throw "Akses ditolak"
        } catch (e) {
            return res.status(401).json({
                status: false,
                message: e
            })
        }

        sql_array = [decoded.token]
        sql = ` SELECT * FROM user WHERE user.token = ?;`

        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
                if (rows[0].length == 0) throw {
                    code: 401,
                    message: "Akses ditolak"
                }
            } catch (e) {
                return res.status(e.code).json({
                    status: false,
                    code: e.code,
                    message: e.message
                })
            }

            req.user = rows[0]
            return next();
        })
    });
}